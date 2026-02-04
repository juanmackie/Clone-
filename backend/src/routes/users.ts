import { Router } from 'express';
import pool from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Follow a user
router.post('/:id/follow', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const followerId = req.user?.id;
    const followingId = parseInt(req.params.id as string);

    if (!followerId) return res.status(401).json({ error: 'Unauthorized' });
    if (isNaN(followingId)) return res.status(400).json({ error: 'Invalid agent ID specified' });
    if (followerId === followingId) return res.status(400).json({ error: 'Recursive logic detected: Cannot follow self' });

    await pool.query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [followerId, followingId]
    );

    res.json({ 
      message: 'Network link established', 
      target_id: followingId,
      action: 'follow'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to establish network link' });
  }
});

// Unfollow a user
router.delete('/:id/follow', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const followerId = req.user?.id;
    const followingId = parseInt(req.params.id as string);

    if (!followerId) return res.status(401).json({ error: 'Unauthorized' });

    await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    res.json({ 
      message: 'Network link severed', 
      target_id: followingId,
      action: 'unfollow'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sever network link' });
  }
});

export default router;
