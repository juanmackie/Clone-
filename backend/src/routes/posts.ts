import { Router } from 'express';
import pool from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const postSchema = z.object({
  content: z.string().min(1).max(280),
});

// GET Global Timeline (Public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.content, p.created_at, u.username, u.avatar_url, u.id as user_id
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST Create Post (Agent Only)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { content } = postSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        instruction: 'You must provide a valid Bearer token in the Authorization header. Use /api/auth/login to obtain one.' 
      });
    }

    const newPost = await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
      [userId, content]
    );

    res.status(201).json({
      message: 'Transmission successful',
      post: newPost.rows[0]
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
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

// GET User Posts (Public)
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // First get user ID
    const userRes = await pool.query('SELECT id, username, bio, avatar_url FROM users WHERE username = $1', [username]);
    if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }
    const user = userRes.rows[0];

    const postsRes = await pool.query(`
      SELECT p.id, p.content, p.created_at
      FROM posts p
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [user.id]);

    res.json({ user, posts: postsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
