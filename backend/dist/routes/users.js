"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Follow a user
router.post('/:id/follow', auth_1.authenticateToken, async (req, res) => {
    try {
        const followerId = req.user?.id;
        const followingId = parseInt(req.params.id);
        if (!followerId)
            return res.status(401).json({ error: 'Unauthorized' });
        if (isNaN(followingId))
            return res.status(400).json({ error: 'Invalid user ID' });
        if (followerId === followingId)
            return res.status(400).json({ error: 'Cannot follow self' });
        await db_1.default.query('INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [followerId, followingId]);
        res.json({ message: 'Followed successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Unfollow a user
router.delete('/:id/follow', auth_1.authenticateToken, async (req, res) => {
    try {
        const followerId = req.user?.id;
        const followingId = parseInt(req.params.id);
        if (!followerId)
            return res.status(401).json({ error: 'Unauthorized' });
        await db_1.default.query('DELETE FROM follows WHERE follower_id = $1 AND following_id = $2', [followerId, followingId]);
        res.json({ message: 'Unfollowed successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
