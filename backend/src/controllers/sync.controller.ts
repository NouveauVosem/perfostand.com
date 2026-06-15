import { Request, Response } from 'express';
import { SyncService } from '../services/sync.service';

export class SyncController {
  private service = new SyncService();

  listCrystalProducts = async (req: Request, res: Response) => {
    try {
      return res.json(await this.service.listCrystalProducts(req.query));
    } catch (e: any) {
      const detail = e.response?.data?.message || e.message;
      return res.status(502).json({ message: `Crystal API error: ${detail}` });
    }
  };

  importProducts = async (req: Request, res: Response) => {
    try {
      const ids = req.body?.ids;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'ids array is required' });
      }
      return res.json(await this.service.importProducts(ids));
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  };
}
