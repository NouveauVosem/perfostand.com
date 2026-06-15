import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import ds from './database/typeorm/data-source';
import { authRoutes, productRoutes, syncRoutes, filesRoutes } from './routes';
import { seedAdmin } from './scripts/seed-admin';

const app = express();
const PORT = process.env.PORT || 8300;

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://admin.perfostand.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(cookieParser());
app.use(compression());

// routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/sync', syncRoutes);
app.use('/files', filesRoutes);

ds.initialize()
  .then(async () => {
    console.log('Data Source has been initialized');
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Perfostand API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  });
