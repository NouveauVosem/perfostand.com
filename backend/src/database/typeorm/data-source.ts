import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { User } from './entity/Users/User.entity';
import { Product } from './entity/Products/Product.entity';
import { ProductType } from './entity/Products/ProductType.entity';
import { ProductVariant } from './entity/Products/ProductVariant.entity';
import { Tag } from './entity/Products/Tags.entity';
import { VariantComponent } from './entity/Products/VariantComponent.entity';
import { ProductCompat } from './entity/Products/ProductCompat.entity';
import { SpecKey } from './entity/Products/SpecKey.entity';
import { SpecificationValue } from './entity/Products/SpecificationValue.entity';
import { SpecEnumRich } from './entity/Products/SpecEnumRich.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  entities: [
    User,
    Product,
    ProductType,
    ProductVariant,
    Tag,
    VariantComponent,
    ProductCompat,
    SpecKey,
    SpecificationValue,
    SpecEnumRich,
  ],
  migrations: [],
  subscribers: [],
});

export default dataSource;
