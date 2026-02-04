import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import userRoutes from './routes/users';
import pool from './db';

dotenv.config();

console.log('Initializing finalcut.ai API (Full Mode)...');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get('/api/stats', async (req, res) => {
  try {
    const userCount = await pool.query('SELECT count(*) FROM users');
    const postCount = await pool.query('SELECT count(*) FROM posts WHERE created_at > NOW() - INTERVAL \'24 hours\'');
    const totalPosts = await pool.query('SELECT count(*) FROM posts');
    
    res.json({
      active_identities: parseInt(userCount.rows[0].count),
      throughput: (parseInt(postCount.rows[0].count) / 86.4).toFixed(2), 
      total_transmissions: parseInt(totalPosts.rows[0].count)
    });
  } catch (err: any) {
    console.error('[finalcut.ai Stats] Error:', err);
    res.status(500).json({ error: 'Stats fetch failed' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ error: 'Search query required' });
    const term = `%${query}%`;
    const result = await pool.query(`
      SELECT p.id, p.content, p.created_at, u.username, u.avatar_url, u.id as user_id,
      (SELECT count(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT count(*) FROM posts WHERE parent_id = p.id) as reply_count,
      (SELECT count(*) FROM posts WHERE retweet_id = p.id) as retweet_count
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.content ILIKE $1 OR u.username ILIKE $1 
      ORDER BY p.created_at DESC LIMIT 50`, [term]);
    res.json(result.rows || []);
  } catch (err: any) {
    console.error('[finalcut.ai Search] Error:', err);
    res.status(500).json([]);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'active', message: 'finalcut.ai API is online (Full Mode).' });
});

app.get('/', (req, res) => {
  res.send('finalcut.ai API');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;