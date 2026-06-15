import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './Product.entity';

// Интерфейс для мультиязычного названия категории
export interface LocalizedContent {
	[langCode: string]: string;
}

// Вторичные имена (синонимы) по регионам для SEO
export interface LocalizedStringArray {
	[langCode: string]: string[];
}

@Entity({ name: 'product_types' })
export class ProductType {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// Код типа (slug) для URL или API (например "display_stands")
	@Column({ type: 'text', unique: true })
	code: string;

	// Название категории { "ru": "Стеллажи", "en": "Display Stands" }
	@Column('jsonb', { default: {} })
	name: LocalizedContent;

	// Краткое описание для AI-контекста при генерации alt-текстов
	@Column({ type: 'text', nullable: true, default: null })
	aiDescription: string | null;

	// Вторичные имена (синонимы) по регионам для SEO { "de": ["Rollwagen", "Rollcontainer"], "ru": [...] }
	@Column('jsonb', { default: {} })
	secondaryNames: LocalizedStringArray;

	// Если true — тип является заголовком группы и не назначается продуктам напрямую
	@Column({ type: 'boolean', default: false })
	isGroup: boolean;

	// Код родительской группы (isGroup: true). null — тип верхнего уровня
	@Column({ type: 'text', nullable: true, default: null })
	parentCode: string | null;

	// Связь: Один тип -> Много продуктов
	@OneToMany(() => Product, (product) => product.productType)
	products: Product[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
