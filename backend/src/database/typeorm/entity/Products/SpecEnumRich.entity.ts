import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Index,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { SpecKey } from './SpecKey.entity';
import { LocalizedContent, IMedia } from './Product.entity';

@Entity({ name: 'spec_enum_rich' })
@Index(['specKey', 'parentSpecKey', 'parentCode'])
export class SpecEnumRich {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => SpecKey, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'spec_key_id' })
	specKeyRef: SpecKey;

	// Код атрибута, которому принадлежит эта опция (дублирует specKeyRef.code для быстрых запросов)
	@Column({ type: 'text' })
	@Index()
	specKey: string; // 'color'

	// Код атрибута, от значения которого зависит эта опция
	@Column({ type: 'text', nullable: true })
	parentSpecKey: string | null; // 'fabric_material'

	// Значение родительского атрибута, при котором эта опция доступна
	@Column({ type: 'text', nullable: true })
	parentCode: string | null; // 'oxf_190'

	// Код опции
	@Column({ type: 'text' })
	code: string; // '01'

	// Локализованные названия
	@Column({ type: 'jsonb', default: {} })
	value: LocalizedContent; // { ru: 'Black', en: 'Black' }

	// Произвольные плоские данные: hex, group, isStockItem и т.д.
	@Column({ type: 'jsonb', default: {} })
	meta: Record<string, any>;

	// Медиа: картинки, видео (texture, swatch, ...)
	@Column({ type: 'jsonb', default: [] })
	media: IMedia[];

	@Column({ type: 'int', default: 0 })
	sortOrder: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
