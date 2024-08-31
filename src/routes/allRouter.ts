import { Router } from 'express';
import { confirmController } from '../controllers/confirmController';
import { uploadController } from '../controllers/uploadController';
import { listController } from '../controllers/listController';

const router = Router();

router.post('/upload', uploadController);
router.get('/readings/:customer_code', listController);
router.patch('/confirm', confirmController);

export default router;
