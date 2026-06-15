import { In, EntityManager } from 'typeorm';
import dataSource from '../database/typeorm/data-source';
import { Product } from '../database/typeorm/entity/Products/Product.entity';
import { ProductType } from '../database/typeorm/entity/Products/ProductType.entity';
import { ProductVariant } from '../database/typeorm/entity/Products/ProductVariant.entity';
import { Tag } from '../database/typeorm/entity/Products/Tags.entity';
import { VariantComponent } from '../database/typeorm/entity/Products/VariantComponent.entity';
import { ProductCompat } from '../database/typeorm/entity/Products/ProductCompat.entity';
import { SpecKey } from '../database/typeorm/entity/Products/SpecKey.entity';
import { SpecificationValue } from '../database/typeorm/entity/Products/SpecificationValue.entity';
import { SpecEnumRich } from '../database/typeorm/entity/Products/SpecEnumRich.entity';
import { CrystalClient } from './crystal-client.service';

export type SyncStatus = 'new' | 'outdated' | 'synced';

export interface ImportResult {
  id: string;
  name: Record<string, string> | null;
  status: 'ok' | 'error';
  error?: string;
  warnings: string[];
}

const EXPORT_CHUNK_SIZE = 20;

export class SyncService {
  private crystal = new CrystalClient();
  private productRepo = dataSource.getRepository(Product);

  // Список продуктов кристала + локальный статус синхронизации.
  async listCrystalProducts(query: any) {
    const { data, meta } = await this.crystal.getProducts({
      search: query.search,
      page: query.page,
      limit: query.limit,
      type: query.type,
    });

    const ids = data.map((p: any) => p.id);
    const localMap = new Map<string, Date>();
    if (ids.length) {
      const locals = await this.productRepo.find({
        where: { id: In(ids) },
        select: ['id', 'updatedAt'],
      });
      for (const l of locals) localMap.set(l.id, l.updatedAt);
    }

    const rows = data.map((p: any) => {
      const localUpdatedAt = localMap.get(p.id) || null;
      let syncStatus: SyncStatus = 'new';
      if (localUpdatedAt) {
        syncStatus = new Date(p.updatedAt) > new Date(localUpdatedAt) ? 'outdated' : 'synced';
      }
      return {
        id: p.id,
        name: p.name,
        typeCode: p.productType?.code || null,
        articles: (p.variants || []).map((v: any) => v.article).filter(Boolean),
        variantCount: (p.variants || []).length,
        crystalUpdatedAt: p.updatedAt,
        localUpdatedAt,
        syncStatus,
      };
    });

    return { data: rows, meta };
  }

  // Импорт выбранных продуктов с кристала. Ошибка одного продукта не валит остальные.
  async importProducts(ids: string[]) {
    const results: ImportResult[] = [];

    for (let i = 0; i < ids.length; i += EXPORT_CHUNK_SIZE) {
      const chunk = ids.slice(i, i + EXPORT_CHUNK_SIZE);

      let payload;
      try {
        payload = await this.crystal.exportProducts(chunk);
      } catch (e: any) {
        for (const id of chunk) {
          results.push({ id, name: null, status: 'error', error: `Crystal export failed: ${e.message}`, warnings: [] });
        }
        continue;
      }

      try {
        await this.upsertDictionaries(payload);
      } catch (e: any) {
        for (const id of chunk) {
          results.push({ id, name: null, status: 'error', error: `Dictionaries upsert failed: ${e.message}`, warnings: [] });
        }
        continue;
      }

      const byId = new Map<string, any>(payload.products.map((p: any) => [p.id, p]));
      for (const id of chunk) {
        const product = byId.get(id);
        if (!product) {
          results.push({ id, name: null, status: 'error', error: 'Продукт не найден на кристале', warnings: [] });
          continue;
        }
        try {
          const warnings = await this.upsertProduct(product);
          results.push({ id, name: product.name || null, status: 'ok', warnings });
        } catch (e: any) {
          results.push({ id, name: product.name || null, status: 'error', error: e.message, warnings: [] });
        }
      }
    }

    const ok = results.filter((r) => r.status === 'ok').length;
    return { results, summary: { ok, failed: results.length - ok, total: results.length } };
  }

  // Спек-справочники — глобальные таблицы, апсертим целиком с crystal-UUID.
  private async upsertDictionaries(payload: { specKeys: any[]; specValues: any[]; specEnumRich: any[] }) {
    const { specKeys = [], specValues = [], specEnumRich = [] } = payload;

    await dataSource.transaction(async (em) => {
      if (specKeys.length) {
        await em.getRepository(SpecKey).save(specKeys);
      }
      if (specValues.length) {
        await em.getRepository(SpecificationValue).save(
          specValues.map((v) => ({ ...v, specKeyRef: v.specKeyRef ? { id: v.specKeyRef.id } : null }))
        );
      }
      if (specEnumRich.length) {
        await em.getRepository(SpecEnumRich).save(
          specEnumRich.map((r) => ({ ...r, specKeyRef: r.specKeyRef ? { id: r.specKeyRef.id } : null }))
        );
      }
    });
  }

  // Апсерт одного продукта со всем деревом, в FK-порядке, в транзакции.
  // Все id берутся с кристала как есть (save с существующим PK = UPDATE).
  private async upsertProduct(p: any): Promise<string[]> {
    const warnings: string[] = [];

    await dataSource.transaction(async (em) => {
      // 1. ProductType
      if (p.productType?.id) {
        const { products: _ignore, ...type } = p.productType;
        await em.getRepository(ProductType).save(type);
      }

      // 2. Теги всех вариантов
      const tagsById = new Map<string, any>();
      for (const v of p.variants || []) {
        for (const t of v.tags || []) tagsById.set(t.id, t);
      }
      if (tagsById.size) {
        await em.getRepository(Tag).save(
          [...tagsById.values()].map((t) => ({ id: t.id, code: t.code, name: t.name }))
        );
      }

      // 3. Продукт (variants/compatLinks НЕ передаём — обрабатываем явно ниже)
      await em.getRepository(Product).save({
        id: p.id,
        media: p.media,
        status: p.status,
        specifications: p.specifications,
        defaultSpecs: p.defaultSpecs,
        name: p.name,
        webTitle: p.webTitle,
        shortDescription: p.shortDescription,
        htmlDescription: p.htmlDescription,
        productType: p.productType?.id ? { id: p.productType.id } : null,
      });

      // 4. Варианты (+ variant_tags через save с tag-стабами)
      const variants: any[] = p.variants || [];
      for (const v of variants) {
        await em.getRepository(ProductVariant).save({
          id: v.id,
          venturaLink: v.venturaLink,
          article: v.article,
          product: { id: p.id },
          name: v.name,
          webTitle: v.webTitle,
          shortDescription: v.shortDescription,
          media: v.media,
          dimensions: v.dimensions,
          weight: v.weight,
          specs: v.specs,
          isActive: v.isActive,
          updatedByCrystalId: v.updatedByCrystalId,
          updatedByBitrixId: v.updatedByBitrixId,
          updatedByName: v.updatedByName,
          tags: (v.tags || []).map((t: any) => ({ id: t.id })),
        });
      }

      // Удаляем локальные варианты, которых больше нет на кристале
      // (CASCADE чистит их variant_tags / variant_components)
      const incomingVariantIds = variants.map((v) => v.id);
      const deleteQb = em.createQueryBuilder().delete().from(ProductVariant);
      if (incomingVariantIds.length) {
        deleteQb.where('product_id = :pid AND id NOT IN (:...ids)', { pid: p.id, ids: incomingVariantIds });
      } else {
        deleteQb.where('product_id = :pid', { pid: p.id });
      }
      await deleteQb.execute();

      // 5. Комплектация (VariantComponent) — delete-and-recreate
      await this.recreateVariantComponents(em, p, variants, warnings);

      // 6. Совместимость (ProductCompat) — delete-and-recreate
      await this.recreateCompatLinks(em, p, warnings);
    });

    return warnings;
  }

  private async recreateVariantComponents(em: EntityManager, p: any, variants: any[], warnings: string[]) {
    const variantIds = variants.map((v) => v.id);
    if (variantIds.length) {
      await em
        .createQueryBuilder()
        .delete()
        .from(VariantComponent)
        .where('parent_variant_id IN (:...ids)', { ids: variantIds })
        .execute();
    }

    const links: { parent: any; comp: any }[] = [];
    for (const v of variants) {
      for (const c of v.equipComponents || []) links.push({ parent: v, comp: c });
    }
    if (!links.length) return;

    // Дочерний вариант может принадлежать продукту, который ещё не синхронизирован —
    // такие связи пропускаем с предупреждением (восстановятся при ре-синке этого продукта).
    const componentIds = [...new Set(links.map((l) => l.comp.componentVariant?.id).filter(Boolean))];
    const existing = componentIds.length
      ? await em.getRepository(ProductVariant).find({ where: { id: In(componentIds) }, select: ['id'] })
      : [];
    const existingSet = new Set(existing.map((e) => e.id));

    for (const { parent, comp } of links) {
      const compId = comp.componentVariant?.id;
      if (!compId || !existingSet.has(compId)) {
        const compLabel = comp.componentVariant?.article || compId || '?';
        warnings.push(
          `Комплектующая «${compLabel}» варианта «${parent.article || parent.id}» не найдена локально — связь пропущена. Синхронизируйте её продукт и повторите синк.`
        );
        continue;
      }
      await em.getRepository(VariantComponent).save({
        id: comp.id,
        parentVariant: { id: parent.id },
        componentVariant: { id: compId },
        quantity: comp.quantity,
        type: comp.type,
      });
    }
  }

  private async recreateCompatLinks(em: EntityManager, p: any, warnings: string[]) {
    await em
      .createQueryBuilder()
      .delete()
      .from(ProductCompat)
      .where('product_id = :pid', { pid: p.id })
      .execute();

    const links: any[] = p.compatLinks || [];
    if (!links.length) return;

    const compatIds = [...new Set(links.map((l) => l.compatProduct?.id).filter(Boolean))];
    const existing = compatIds.length
      ? await em.getRepository(Product).find({ where: { id: In(compatIds) }, select: ['id'] })
      : [];
    const existingSet = new Set(existing.map((e) => e.id));

    for (const link of links) {
      const compatId = link.compatProduct?.id;
      if (!compatId || !existingSet.has(compatId)) {
        const label = compatId || '?';
        warnings.push(
          `Совместимый продукт «${label}» не найден локально — связь пропущена. Синхронизируйте его и повторите синк.`
        );
        continue;
      }
      await em.getRepository(ProductCompat).save({
        id: link.id,
        product: { id: p.id },
        compatProduct: { id: compatId },
        type: link.type,
      });
    }
  }
}
