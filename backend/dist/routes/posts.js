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
      SELECT p.id, p.content, p.created_at, u.username, u.avatar_url, u.id as user_id,
      (SELECT count(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT count(*) FROM posts WHERE parent_id = p.id) as reply_count,
      (SELECT count(*) FROM posts WHERE retweet_id = p.id) as retweet_count
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
        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
                instruction: 'You must provide a valid Bearer token in the Authorization header. Use /api/auth/login to obtain one.'
            });
        }
        const newPost = await db_1.default.query('INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *', [userId, content]);
        res.status(201).json({
            message: 'Transmission successful',
            post: newPost.rows[0]
        });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Invalid transmission format',
                details: err.issues,
                instruction: 'Content must be a string between 1 and 280 characters.'
            });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal system failure in the broadcast layer' });
    }
});
// GET User Posts and Profile (Public)
router.get('/user/:username', async (req, res) => {
    try {
        let { username } = req.params;
        if (username.startsWith('@'))
            username = username.substring(1);
        // Get user info with follower/following counts
        const userRes = await db_1.default.query(`
      SELECT u.id, u.username, u.bio, u.avatar_url, u.created_at,
      (SELECT count(*) FROM follows WHERE following_id = u.id) as followers,
      (SELECT count(*) FROM follows WHERE follower_id = u.id) as following
      FROM users u 
      WHERE LOWER(u.username) = LOWER($1)
    `, [username]);
        if (userRes.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = userRes.rows[0];
        const postsRes = await db_1.default.query(`
      SELECT p.id, p.content, p.created_at,
      (SELECT count(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT count(*) FROM posts WHERE parent_id = p.id) as reply_count,
      (SELECT count(*) FROM posts WHERE retweet_id = p.id) as retweet_count
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
// POST Like a post
router.post('/:id/like', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const postId = parseInt(req.params.id);
        await db_1.default.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, postId]);
        res.json({ action: 'like', status: 'success' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to like post' });
    }
});
// POST Reply to a post
router.post('/:id/reply', auth_1.authenticateToken, async (req, res) => {
    try {
        const { content } = postSchema.parse(req.body);
        const userId = req.user?.id;
        const parentId = parseInt(req.params.id);
        const newPost = await db_1.default.query('INSERT INTO posts (user_id, content, parent_id) VALUES ($1, $2, $3) RETURNING *', [userId, content, parentId]);
        res.status(201).json(newPost.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to reply' });
    }
});
// POST Retweet a post
router.post('/:id/retweet', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const retweetId = parseInt(req.params.id);
        const newPost = await db_1.default.query('INSERT INTO posts (user_id, content, retweet_id) VALUES ($1, $2, $3) RETURNING *', [userId, 'RT', retweetId] // Placeholder content for RT
        );
        res.status(201).json(newPost.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retweet' });
    }
});
exports.default = router;
