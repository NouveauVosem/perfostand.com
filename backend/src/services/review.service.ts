import dataSource from '../database/typeorm/data-source';
import { Review, ReviewStatus } from '../database/typeorm/entity/Reviews/Review.entity';
import { WebdavService } from './synology.service';

export interface CreateReviewInput {
  name: string;
  company?: string | null;
  email?: string | null;
  message: string;
}

export interface UploadedPhoto {
  buffer: Buffer;
  originalname: string;
}

export class ReviewService {
  private repo = dataSource.getRepository(Review);
  private webdav = new WebdavService();

  async create(input: CreateReviewInput, photos: UploadedPhoto[]): Promise<Review> {
    const name = input.name?.trim();
    const message = input.message?.trim();

    if (!name) throw new Error('Имя обязательно');
    if (!message) throw new Error('Текст отзыва обязателен');

    // Сначала создаём запись, чтобы получить id для папки на Synology.
    const review = this.repo.create({
      name,
      company: input.company?.trim() || null,
      email: input.email?.trim() || null,
      message,
      photos: [],
      status: 'pending',
    });
    await this.repo.save(review);

    if (photos.length) {
      const folder = `reviews/${review.id}`;
      const paths: string[] = [];
      for (const photo of photos) {
        const remotePath = await this.webdav.uploadFile(photo.buffer, photo.originalname, folder);
        paths.push(remotePath);
      }
      review.photos = paths;
      await this.repo.save(review);
    }

    return review;
  }

  async getAll(status?: ReviewStatus): Promise<Review[]> {
    return this.repo.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async getOne(id: string): Promise<Review> {
    const review = await this.repo.findOne({ where: { id } });
    if (!review) throw new Error('Review not found');
    return review;
  }

  async updateStatus(id: string, status: ReviewStatus): Promise<Review> {
    const review = await this.getOne(id);
    review.status = status;
    return this.repo.save(review);
  }

  async delete(id: string): Promise<{ deleted: true }> {
    const review = await this.getOne(id);
    if (review.photos?.length) {
      for (const filePath of review.photos) {
        await this.webdav.deleteFile(filePath);
      }
      await this.webdav.deleteDirectory(this.webdav.getAbsolutePath(`reviews/${review.id}`));
    }
    await this.repo.remove(review);
    return { deleted: true };
  }

  async getPhotoStream(id: string, index: number) {
    const review = await this.getOne(id);
    const filePath = review.photos?.[index];
    if (!filePath) throw new Error('Photo not found');
    return this.webdav.getFileStream(filePath);
  }
}
