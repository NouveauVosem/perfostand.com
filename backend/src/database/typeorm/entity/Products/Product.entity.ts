import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
	ManyToOne,
	JoinColumn,
	ManyToMany,
	JoinTable,
	OneToMany
} from 'typeorm';
import { ProductType } from './ProductType.entity';
import { ProductVariant } from './ProductVariant.entity';
import { ProductCompat } from './ProductCompat.entity';

export interface LocalizedContent {
	[langCode: string]: string;
}

export interface IMedia {
	url: string;
	order: number;
	typeOfMedia: 'image' | 'video';
	useType: string;
	alt: string | LocalizedContent;
}

@Entity({ name: 'products' })
@Index('IDX_product_specifications_gin', ['specifications'], { using: 'GIN' } as any)
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('jsonb', { default: [] })
	media: IMedia[];

	@ManyToOne(() => ProductType, (type) => type.products, {
		onDelete: 'SET NULL' // Если категорию удалят, товар останется без категории
	})
	@JoinColumn({ name: 'product_type_id' })
	productType: ProductType;

	@Column({ type: 'text', nullable: true })
	status: string;


	// JSONB c кодами спецификаций
	// Храним так: { "color": ["red", "black"], "material": ["steel"] }
	@Column({ type: 'jsonb', default: {} })
	specifications: Record<string, string[]>;

	// Дефолтные спеки продукта — наследуются вариантами если не переопределены
	@Column({ type: 'jsonb', default: {} })
	defaultSpecs: Record<string, any>;

	// Переводы названий { "ru": "Стеллаж", "en": "Stand" }
	@Column({ type: 'jsonb', default: {} })
	name: Record<string, string>;

	@Column({ type: 'jsonb', default: {} })
	webTitle: Record<string, string>;

	@Column({ type: 'jsonb', default: {} })
	shortDescription: Record<string, string>;

	@Column({ type: 'jsonb', default: {} })
	htmlDescription: Record<string, string>;

	@OneToMany(() => ProductVariant, (variant) => variant.product, {
		cascade: true
	})
	variants: ProductVariant[];

	@OneToMany(() => ProductCompat, (pc) => pc.product, { cascade: true })
	compatLinks: ProductCompat[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

// const json = {
// 		"id": "uuid-or-null",
// 		"type": "DISPLAY_STAND", // { "type": "DISPLAY_STAND", "name": { "ru": "Стеллаж", "en": "Stand"}, "code": "display_stand" }
// 		"status": "active",

// 		"tags": ["case", "external", "with_cutouts", "white"], //  {  "name": { "ru": "новый", "en": "new"}, "code": "new" }

// 		"media": {
//
// 		},

// 		"variants": [
// 			{
// 				"name": { "ru": "Сборка корма для живоитных стелажей", "en": "Stand"},
// 				"article": "01.0001.01",
//         "venturaLink": ":13:1245:124512:123",
// 				"media": {
// 					"images": [{"url": '123', "type": "marketing", "alt": '1', "order": 1}],
// 					"video": {
// 						"url": "https://youtube.com/..."
// 					}
// 				},

// 			}
// 		],

// 		"specifications": {
// 			"cover": ["zinc", "powder_paint"],

// 			"internal_height": [400, 500],
// 			"internal_width": [400, 500],
// 			"internal_depth": [400, 500],
// 			"internal_weight": [400, 500],
// 			"external_height": [110, 120],
// 			"external_width": [60, 170],
// 			"external_depth": [50, 180],
// 			"external_weight": [180, 190],

// 			"materialsUsed": ["steel_c245", "plastic"],

//       "shelfAngle": ["90", "45-90"],

// 			"equipDefault": ["bumper", "shelf", "label_plate", "wheels"],

// 			"equipOptional": ["plastic_base", "shelf", "cap"]
// 		},

// 		"name": {
// 			"ru": "Стеллаж Евро+",
// 			"en": "Euro+ Stand",
// 			"uk": "Стелаж Євро+"
// 		},

// 		"shortDescription": {
// 			"ru": "Металлический стеллаж для кормов",
// 			"en": "Metal stand for pet food",
// 			"uk": "Металевий стелаж для кормів"
// 		},

// 		"htmlDescription": {
// 			"ru": "<p>Подробное описание</p>",
// 			"en": "<p>Detailed description</p>",
// 			"uk": "<p>Детальний опис</p>"
// 		}
// }
