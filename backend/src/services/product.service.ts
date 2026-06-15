import dataSource from '../database/typeorm/data-source';
import { Product } from '../database/typeorm/entity/Products/Product.entity';
import { SpecKey } from '../database/typeorm/entity/Products/SpecKey.entity';

export class ProductService {
  private productRepo = dataSource.getRepository(Product);
  private specKeyRepo = dataSource.getRepository(SpecKey);

  // Все спек-ключи (для расшифровки кодов спеков в детальном просмотре).
  async getSpecKeys() {
    return this.specKeyRepo.find({ order: { sortOrder: 'ASC' } });
  }

  async getAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.productType', 'pt')
      .leftJoinAndSelect('p.variants', 'v')
      .leftJoinAndSelect('v.tags', 'tag')
      .orderBy('p.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.type) qb.andWhere('pt.code = :typeCode', { typeCode: query.type });
    if (query.search) qb.andWhere('(CAST(p.name AS TEXT) ILIKE :search OR v.article ILIKE :search)', { search: `%${query.search}%` });

    const [products, total] = await qb.getManyAndCount();

    return {
      data: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'productType',
        'variants',
        'variants.tags',
        'variants.equipComponents',
        'variants.equipComponents.componentVariant',
        'compatLinks',
        'compatLinks.compatProduct',
      ],
    });

    if (!product) throw new Error('Product not found');

    return product;
  }

  async delete(id: string) {
    return await this.productRepo.delete(id);
  }
}
