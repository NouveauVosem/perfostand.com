import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { LocalizedContent } from "./Product.entity";
import { ProductVariant } from "./ProductVariant.entity";

@Entity("tags")
export class Tag {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("jsonb", { default: {} })
    name: LocalizedContent;

    @Column({ type: "text", unique: true })
    code: string;

    @ManyToMany(() => ProductVariant, (variant) => variant.tags)
    variants: ProductVariant[];
}