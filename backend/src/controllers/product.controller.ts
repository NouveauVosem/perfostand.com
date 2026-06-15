import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  private service = new ProductService();

  getAll = async (req: Request, res: Response) => {
    try {
      return res.json(await this.service.getAll(req.query));
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  };

  getSpecKeys = async (_req: Request, res: Response) => {
    try {
      return res.json(await this.service.getSpecKeys());
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      return res.json(await this.service.getOne(String(req.params.id)));
    } catch (e: any) {
      if (e.message === 'Product not found') {
        return res.status(404).json({ message: 'Товар не найден' });
      }
      return res.status(500).json({ message: e.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      return res.json(await this.service.delete(String(req.params.id)));
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  };
}
