import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { SpecKey } from './SpecKey.entity';

export interface LocalizedContent {
    [langCode: string]: string;
}

@Entity({ name: 'specification_values' })
export class SpecificationValue {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    @Index()
    code: string; // "round_tube", "zinc"

    // FK → SpecKey (заменяет строковое поле specKey)
    @ManyToOne(() => SpecKey, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'spec_key_id' })
    specKeyRef: SpecKey;

    // Строковый ключ оставляем для обратной совместимости с product.specifications / variant.specs
    @Column({ type: 'text' })
    @Index()
    specKey: string; // "wall_type" — дублирует specKeyRef.code для быстрых запросов

    // { "ru": "Круглая труба", "cs": "Kulatá trubka", "en": "Round tube" }
    @Column('jsonb', { default: {} })
    value: LocalizedContent;
}
