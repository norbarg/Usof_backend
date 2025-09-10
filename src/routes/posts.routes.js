import { Router } from 'express';
import { PostController } from '../controllers/PostController.js';
import { CommentController } from '../controllers/CommentController.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();
// public list
r.get('/', PostController.list);
r.get('/:post_id', PostController.getById);
r.get('/:post_id/comments', PostController.listComments);
r.get('/:post_id/categories', PostController.listCategories);
r.get('/:post_id/like', PostController.likeList);

r.post('/', authRequired, PostController.create);
r.post('/:post_id/comments', authRequired, CommentController.createUnderPost);
r.post('/:post_id/like', authRequired, PostController.likeCreate);

r.patch('/:post_id', authRequired, PostController.update);
r.delete('/:post_id', authRequired, PostController.remove);
r.delete('/:post_id/like', authRequired, PostController.likeDelete);

export default r;
