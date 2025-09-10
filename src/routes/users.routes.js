//routes/users.routes.js
import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authRequired, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const r = Router();
r.get('/', authRequired, requireRole('admin'), UserController.getAll); // admin only
r.get('/:user_id', authRequired, UserController.getById);
r.post('/', authRequired, requireRole('admin'), UserController.create); // admin creates users/admins
r.patch(
    '/avatar',
    authRequired,
    upload.single('avatar'),
    UserController.uploadAvatar
);
r.patch('/:user_id', authRequired, UserController.update);
r.delete('/:user_id', authRequired, UserController.remove);
export default r;
