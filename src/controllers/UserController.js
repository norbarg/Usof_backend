//controllers/UserController.js
import { Users } from '../models/UserModel.js';
import { upload } from '../middleware/upload.js'; // not used directly here, kept for reference

export const UserController = {
    async getAll(req, res) {
        const users = await Users.all();
        res.json(users);
    },
    async getById(req, res) {
        const id = +req.params.user_id;
        const user = await Users.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    },
    async create(req, res) {
        const { login, password_hash, full_name, email, role } = req.body;
        if (!login || !password_hash || !full_name || !email)
            return res.status(400).json({ error: 'Missing fields' });
        const user = await Users.create({
            login,
            password_hash,
            full_name,
            email,
            role,
        });
        res.status(201).json(user);
    },
    async update(req, res) {
        const id = +req.params.user_id;
        // self or admin
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const allowed = ['full_name', 'email', 'role', 'profile_picture'];
        const data = {};
        for (const k of allowed) if (k in req.body) data[k] = req.body[k];
        const updated = await Users.updateById(id, data);
        res.json(updated);
    },
    async uploadAvatar(req, res) {
        if (!req.file)
            return res.status(400).json({ error: 'No file uploaded' });
        const updated = await Users.updateById(req.user.id, {
            profile_picture: `/${req.file.path}`,
        });
        res.json({
            message: 'Avatar updated',
            profile_picture: updated.profile_picture,
        });
    },
    async remove(req, res) {
        const id = +req.params.user_id;
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await Users.deleteById(id);
        res.json({ message: 'User deleted' });
    },
};
