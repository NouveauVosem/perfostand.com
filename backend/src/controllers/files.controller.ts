import { Request, Response } from 'express';
import { CrystalClient } from '../services/crystal-client.service';

export class FilesController {
  private crystal = new CrystalClient();

  // Проксирует картинку с кристала (его /files/image публичный, отдаёт стрим с WebDAV).
  // Без авторизации — чтобы работал обычный <img src>. Путь приходит из media[].url.
  getImage = async (req: Request, res: Response) => {
    const filePath = req.query.path;
    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ message: 'path query param is required' });
    }

    try {
      const upstream = await this.crystal.getImageStream(filePath);

      if (upstream.status >= 400) {
        return res.status(upstream.status === 404 ? 404 : 502).json({ message: 'Файл не найден' });
      }

      const contentType = (upstream.headers['content-type'] as string) || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');

      upstream.data.on('error', () => {
        if (!res.headersSent) res.status(502).end();
      });
      upstream.data.pipe(res);
    } catch (e: any) {
      if (!res.headersSent) res.status(502).json({ message: `Crystal image error: ${e.message}` });
    }
  };
}
