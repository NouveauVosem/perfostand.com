import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const controller = new SyncController();

router.get('/crystal-products', authenticate, controller.listCrystalProducts);
router.post('/import', authenticate, controller.importProducts);

export default router;
