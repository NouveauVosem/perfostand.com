import { Request, Response } from 'express';
import path from 'path';
import { ReviewService, UploadedPhoto } from '../services/review.service';
import { ReviewStatus } from '../database/typeorm/entity/Reviews/Review.entity';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export class ReviewController {
  private service = new ReviewService();

  // Публичный эндпоинт: оставить отзыв (multipart/form-data, поле photos[]).
  create = async (req: Request, res: Response) => {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      const photos: UploadedPhoto[] = files.map((f) => ({
        buffer: f.buffer,
        originalname: f.originalname,
      }));

      const review = await this.service.create(
        {
          name: req.body.name,
          company: req.body.company,
          email: req.body.email,
          message: req.body.message,
        },
        photos
      );

      return res.status(201).json({ id: review.id, status: review.status });
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  };

  // Публичный список одобренных отзывов (для отображения на сайте).
  getApproved = async (_req: Request, res: Response) => {
    try {
      const reviews = await this.service.getAll('approved');
      return res.json(
        reviews.map((r) => ({
          id: r.id,
          name: r.name,
          company: r.company,
          message: r.message,
          photos: r.photos.map((_, i) => `/reviews/${r.id}/photo/${i}`),
          createdAt: r.createdAt,
        }))
      );
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  };

  // Публичный прокси фото с Synology (для <img src>).
  getPhoto = async (req: Request, res: Response) => {
    try {
      const index = parseInt(String(req.params.index), 10);
      const review = await this.service.getOne(String(req.params.id));
      const filePath = review.photos?.[index];
      if (!filePath) return res.status(404).json({ message: 'Photo not found' });

      const stream = await this.service.getPhotoStream(String(req.params.id), index);
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', CONTENT_TYPES[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=86400');

      stream.on('error', () => {
        if (!res.headersSent) res.status(404).end();
      });
      stream.pipe(res);
    } catch (e: any) {
      if (!res.headersSent) res.status(404).json({ message: e.message });
    }
  };

  // --- Админка ---
  getAll = async (req: Request, res: Response) => {
    try {
      const status = req.query.status as ReviewStatus | undefined;
      return res.json(await this.service.getAll(status));
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const status = req.body.status as ReviewStatus;
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      return res.json(await this.service.updateStatus(String(req.params.id), status));
    } catch (e: any) {
      const code = e.message === 'Review not found' ? 404 : 500;
      return res.status(code).json({ message: e.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      return res.json(await this.service.delete(String(req.params.id)));
    } catch (e: any) {
      const code = e.message === 'Review not found' ? 404 : 500;
      return res.status(code).json({ message: e.message });
    }
  };
}
