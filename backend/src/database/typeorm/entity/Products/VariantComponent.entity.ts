import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ProductVariant } from './ProductVariant.entity';

export type CompatType = 'option' | 'detail';

@Entity({ name: 'variant_components' })
@Index(['parentVariant', 'componentVariant', 'type'], { unique: true })
export class VariantComponent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ProductVariant, (v) => v.equipComponents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_variant_id' })
    parentVariant: ProductVariant;

    @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE', eager: false })
    @JoinColumn({ name: 'component_variant_id' })
    componentVariant: ProductVariant;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'text' })
    type: CompatType;
}
