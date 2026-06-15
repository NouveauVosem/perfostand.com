import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Product, LocalizedContent, IMedia } from "./Product.entity";
import { Tag } from "./Tags.entity";
import { VariantComponent } from "./VariantComponent.entity";

@Entity("product_variants")
export class ProductVariant {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // Ссылка на легаси (Уникальна для варианта)
    @Column({ type: "text", unique: true, nullable: true })
    @Index()
    venturaLink: string | null;

    @Column({ type: "text", nullable: true })
    @Index()
    article: string; // Артикул варианта (01.0001.01)

    @ManyToOne(() => Product, (product) => product.variants, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column("jsonb", { default: {} })
    name: LocalizedContent;

    @Column("jsonb", { nullable: true })
    webTitle: LocalizedContent | null;

    @Column("jsonb", { nullable: true })
    shortDescription: LocalizedContent | null;

    // Медиа конкретного варианта (чертеж именно этого размера)
    @Column("jsonb", { default: [] })
    media: IMedia[];

    // Габариты — есть у любого физического объекта
    @Column({ type: 'jsonb', default: {} })
    dimensions: {
        external?: { height?: number; width?: number; depth?: number };
        internal?: { height?: number; width?: number; depth?: number };
    };

    // Вес нетто (кг) — без упаковки
    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    weight: number | null;

    // --- ХАРАКТЕРИСТИКИ ВАРИАНТА (продуктовые спецификации) ---
    // Ключ: код характеристики (совпадает с SpecKey.code)
    // Значение:
    //   enum  → string (код из SpecificationValue): "zinc"
    //   float → number (одно значение): 300
    //   float + allowRange → number[] (диапазон [min, max]): [29, 37]
    //   text  → string (произвольный текст): "round tubes"
    @Column("jsonb", { default: {} })
    specs: Record<string, string | number | number[]>;

    @ManyToMany(() => Tag, (tag) => tag.variants, { cascade: true })
    @JoinTable({
        name: 'variant_tags',
        joinColumn: { name: 'variant_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
    })
    tags: Tag[];

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => VariantComponent, (vc) => vc.parentVariant)
    equipComponents: VariantComponent[];

    @Column({ nullable: true, type: 'uuid' })
    updatedByCrystalId: string | null;

    @Column({ nullable: true, type: 'int' })
    updatedByBitrixId: number | null;

    @Column({ nullable: true, type: 'varchar' })
    updatedByName: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}