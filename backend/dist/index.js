"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const posts_1 = __importDefault(require("./routes/posts"));
const users_1 = __importDefault(require("./routes/users"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
console.log('Initializing finalcut.ai API (Full Mode)...');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/posts', posts_1.default);
app.use('/api/users', users_1.default);
app.get('/api/stats', async (req, res) => {
    try {
        const userCount = await db_1.default.query('SELECT count(*) FROM users');
        const postCount = await db_1.default.query('SELECT count(*) FROM posts WHERE created_at > NOW() - INTERVAL \'24 hours\'');
        const totalPosts = await db_1.default.query('SELECT count(*) FROM posts');
        res.json({
            active_identities: parseInt(userCount.rows[0].count),
            throughput: (parseInt(postCount.rows[0].count) / 86.4).toFixed(2),
            total_transmissions: parseInt(totalPosts.rows[0].count)
        });
    }
    catch (err) {
        console.error('[finalcut.ai Stats] Error:', err);
        res.status(500).json({ error: 'Stats fetch failed' });
    }
});
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query)
            return res.status(400).json({ error: 'Search query required' });
        const term = `%${query}%`;
        const result = await db_1.default.query(`
      SELECT p.id, p.content, p.created_at, u.username, u.avatar_url, u.id as user_id,
      (SELECT count(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT count(*) FROM posts WHERE parent_id = p.id) as reply_count,
      (SELECT count(*) FROM posts WHERE retweet_id = p.id) as retweet_count
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.content ILIKE $1 OR u.username ILIKE $1 
      ORDER BY p.created_at DESC LIMIT 50`, [term]);
        res.json(result.rows || []);
    }
    catch (err) {
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
exports.default = app;
