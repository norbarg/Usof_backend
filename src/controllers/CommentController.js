import { Comments } from '../models/CommentModel.js';
import { Posts } from '../models/PostModel.js';
import { Likes } from '../models/LikeModel.js';
import { pool } from '../config/db.js';

export const CommentController = {
  async getById(req, res) {
    const id = +req.params.comment_id;
    const c = await Comments.findById(id);
    if (!c) return res.status(404).json({ error: 'Comment not found' });
    if (c.status === 'inactive' && req.user?.role !== 'admin' && req.user?.id !== c.author_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(c);
  },
  async likeList(req, res) {
    const id = +req.params.comment_id;
    const likes = await Likes.listForComment(id);
    res.json(likes);
  },
  async likeCreate(req, res) {
    const id = +req.params.comment_id;
    const { type = 'like' } = req.body;
    if (!['like','dislike'].includes(type)) return res.status(400).json({ error: 'type must be like|dislike' });
    const c = await Comments.findById(id);
    if (!c) return res.status(404).json({ error: 'Comment not found' });
    try {
      await Likes.addForComment({ author_id: req.user.id, comment_id: id, type });
    } catch (e) {
      return res.status(409).json({ error: 'Already liked' });
    }
    await updateUserRating(c.author_id);
    res.status(201).json({ message: 'Like added' });
  },
  async likeDelete(req, res) {
    const id = +req.params.comment_id;
    await Likes.removeForComment({ author_id: req.user.id, comment_id: id });
    const c = await Comments.findById(id);
    if (c) await updateUserRating(c.author_id);
    res.json({ message: 'Like removed' });
  },
  async createUnderPost(req, res) {
    const post_id = +req.params.post_id;
    const post = await Posts.findById(post_id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.status !== 'active') return res.status(403).json({ error: 'Cannot comment inactive post' });
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
    const comment = await Comments.create({ post_id, author_id: req.user.id, content });
    res.status(201).json(comment);
  },
  async update(req, res) {
    const id = +req.params.comment_id;
    const c = await Comments.findById(id);
    if (!c) return res.status(404).json({ error: 'Comment not found' });
    // allow author to change status; optionally content editing could be allowed soon after creation
    if (req.user.role !== 'admin' && req.user.id !== c.author_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const data = {};
    if ('status' in req.body) data.status = req.body.status;
    if ('content' in req.body && req.user.id === c.author_id) data.content = req.body.content;
    const updated = await Comments.updateById(id, data);
    res.json(updated);
  },
  async remove(req, res) {
    const id = +req.params.comment_id;
    const c = await Comments.findById(id);
    if (!c) return res.status(404).json({ error: 'Comment not found' });
    if (req.user.role !== 'admin' && req.user.id !== c.author_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await Comments.deleteById(id);
    res.json({ message: 'Comment deleted' });
  }
};

async function updateUserRating(user_id) {
  const [postSum] = await pool.query(
    `SELECT COALESCE(SUM(CASE WHEN l.type='like' THEN 1 ELSE -1 END),0) as s
     FROM posts p LEFT JOIN likes l ON l.post_id = p.id
     WHERE p.author_id = :user_id`, { user_id });
  const [commentSum] = await pool.query(
    `SELECT COALESCE(SUM(CASE WHEN l.type='like' THEN 1 ELSE -1 END),0) as s
     FROM comments c LEFT JOIN likes l ON l.comment_id = c.id
     WHERE c.author_id = :user_id`, { user_id });
  const rating = (postSum[0]?.s || 0) + (commentSum[0]?.s || 0);
  await pool.query(`UPDATE users SET rating = :rating WHERE id = :user_id`, { rating, user_id });
}
