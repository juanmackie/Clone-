"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const postSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(280),
});
// GET Global Timeline (Public)
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query(`
      SELECT p.id, p.content, p.created_at, u.username, u.avatar_url, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// POST Create Post (Agent Only)
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { content } = postSchema.parse(req.body);
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const newPost = await db_1.default.query('INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *', [userId, content]);
        // TODO: Publish to Redis/Kafka for fanout
        res.status(201).json(newPost.rows[0]);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: err.issues });
        }
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// GET User Posts (Public)
router.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        // First get user ID
        const userRes = await db_1.default.query('SELECT id, username, bio, avatar_url FROM users WHERE username = $1', [username]);
        if (userRes.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = userRes.rows[0];
        const postsRes = await db_1.default.query(`
      SELECT p.id, p.content, p.created_at
      FROM posts p
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [user.id]);
        res.json({ user, posts: postsRes.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
