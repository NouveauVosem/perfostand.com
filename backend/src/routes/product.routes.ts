import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const controller = new ProductController();

router.get('/getAll', authenticate, controller.getAll);
router.get('/spec-keys', authenticate, controller.getSpecKeys);
router.get('/getOne/:id', authenticate, controller.getOne);
router.delete('/delete/:id', authenticate, controller.delete);

export default router;
