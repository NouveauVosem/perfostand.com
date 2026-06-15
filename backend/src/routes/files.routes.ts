import { Router } from 'express';
import { FilesController } from '../controllers/files.controller';

const router = Router();
const controller = new FilesController();

// Публичный прокси картинок (для <img src>, который не умеет слать Bearer-токен).
router.get('/image', controller.getImage);

export default router;
