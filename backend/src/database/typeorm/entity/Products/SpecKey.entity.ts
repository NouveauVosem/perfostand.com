import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { LocalizedContent } from './Product.entity';

export type SpecValueType = 'enum' | 'float' | 'text' | 'enum_rich';

@Entity({ name: 'spec_keys' })
export class SpecKey {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Код ключа — совпадает с specKey в SpecificationValue и ключами в specs/specifications
    @Column({ type: 'text', unique: true })
    @Index()
    code: string; // 'weight', 'load_capacity', 'color', 'wall_type'

    // Переводы названия: { "cs": "Váha produktu", "ru": "Вес продукта", "en": "Product weight" }
    @Column({ type: 'jsonb', default: {} })
    labels: LocalizedContent;

    // Тип значения: enum (коды из SpecificationValue), float (числа), text (строки)
    @Column({ type: 'text' })
    valueType: SpecValueType;

    // Единица измерения — только для float: { cs: 'kg', ru: 'кг', en: 'kg' }
    @Column({ type: 'jsonb', nullable: true })
    unit: LocalizedContent | null;

    // Префикс отображения — только для float: 'max' → "max. 300 kg", 'min' → "min. 10 kg"
    @Column({ type: 'text', nullable: true })
    displayPrefix: 'max' | 'min' | null;

    // Разрешает диапазон (два числа) для float: true → "29-37 kg"
    // В ProductVariant.specs хранится как массив: [29, 37]
    @Column({ type: 'boolean', default: false })
    allowRange: boolean;

    // Порядок отображения
    @Column({ type: 'int', default: 0 })
    sortOrder: number;

    // null = показывать для всех типов продуктов
    @Column({ type: 'text', array: true, nullable: true, default: null })
    productTypeCodes: string[] | null;

    // Важная спецификация — используется при генерации веб-тайтлов
    @Column({ type: 'boolean', default: false })
    important: boolean;

    // Код родительского атрибута, от значения которого зависит этот (только для enum_rich)
    // Напр. 'color' dependsOnCode = 'fabric_material'
    @Column({ type: 'text', nullable: true, default: null })
    dependsOnCode?: string | null;
}
