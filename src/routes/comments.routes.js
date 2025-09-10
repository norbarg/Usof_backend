import { Router } from 'express';
import { CommentController } from '../controllers/CommentController.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();
r.get('/:comment_id', CommentController.getById);
r.get('/:comment_id/like', CommentController.likeList);
r.post('/:comment_id/like', authRequired, CommentController.likeCreate);
r.delete('/:comment_id/like', authRequired, CommentController.likeDelete);
r.patch('/:comment_id', authRequired, CommentController.update);
r.delete('/:comment_id', authRequired, CommentController.remove);
export default r;
