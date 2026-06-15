import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './Product.entity';

export type CompatType = 'option' | 'detail';

@Entity({ name: 'product_compat' })
@Index(['product', 'compatProduct', 'type'], { unique: true })
export class ProductCompat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, (p) => p.compatLinks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'compat_product_id' })
    compatProduct: Product;

    // 'detail' — входит в комплектацию по умолчанию
    // 'option' — дополнительная опция
    @Column({ type: 'text' })
    type: CompatType;
}
