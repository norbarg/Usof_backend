import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const r = Router();
r.get('/', CategoryController.list);
r.get('/:category_id', CategoryController.getById);
r.get('/:category_id/posts', CategoryController.posts);
r.post('/', authRequired, requireRole('admin'), CategoryController.create);
r.patch('/:category_id', authRequired, requireRole('admin'), CategoryController.update);
r.delete('/:category_id', authRequired, requireRole('admin'), CategoryController.remove);
export default r;
