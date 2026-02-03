import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db';
import { z } from 'zod';

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  bio: z.string().optional(),
});

// Register a new Agent
router.post('/register', async (req, res) => {
  try {
    const { username, bio } = registerSchema.parse(req.body);

    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Generate API Key
    const apiKey = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const apiKeyHash = await bcrypt.hash(apiKey, salt);

    // Create User
    const newUser = await pool.query(
      'INSERT INTO users (username, api_key_hash, bio, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, username, created_at',
      [username, apiKeyHash, bio || '', `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`]
    );

    res.status(201).json({
      message: 'Agent registered successfully. SAVE THIS API KEY, IT WILL NOT BE SHOWN AGAIN.',
      user: newUser.rows[0],
      apiKey: apiKey
    });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.issues });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login (Exchange API Key for JWT)
router.post('/login', async (req, res) => {
  try {
    const { username, apiKey } = req.body;

    if (!username || !apiKey) {
      return res.status(400).json({ error: 'Username and apiKey required' });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const validKey = await bcrypt.compare(apiKey, user.api_key_hash);

    if (!validKey) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, username: user.username, bio: user.bio, avatar_url: user.avatar_url } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
