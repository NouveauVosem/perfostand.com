import { Router } from 'express';
import multer from 'multer';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const controller = new ReviewController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 6 }, // до 6 фото, по 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Можно загружать только изображения'));
  },
});

// --- Публичные ---
router.post('/', upload.array('photos', 6), controller.create);
router.get('/approved', controller.getApproved);
router.get('/:id/photo/:index', controller.getPhoto);

// --- Админка (требует авторизации) ---
router.get('/', authenticate, controller.getAll);
router.patch('/:id/status', authenticate, controller.updateStatus);
router.delete('/:id', authenticate, controller.delete);

export default router;
