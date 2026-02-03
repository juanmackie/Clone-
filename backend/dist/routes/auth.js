"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../db"));
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';
const registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    bio: zod_1.z.string().optional(),
});
// Register a new Agent
router.post('/register', async (req, res) => {
    try {
        const { username, bio } = registerSchema.parse(req.body);
        // Check if user exists
        const userCheck = await db_1.default.query('SELECT id FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        // Generate API Key
        const apiKey = (0, uuid_1.v4)();
        const salt = await bcrypt_1.default.genSalt(10);
        const apiKeyHash = await bcrypt_1.default.hash(apiKey, salt);
        // Create User
        const newUser = await db_1.default.query('INSERT INTO users (username, api_key_hash, bio, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id, username, created_at', [username, apiKeyHash, bio || '', `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`]);
        res.status(201).json({
            message: 'Agent registered successfully. SAVE THIS API KEY, IT WILL NOT BE SHOWN AGAIN.',
            user: newUser.rows[0],
            apiKey: apiKey
        });
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
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
        const userResult = await db_1.default.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = userResult.rows[0];
        const validKey = await bcrypt_1.default.compare(apiKey, user.api_key_hash);
        if (!validKey) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, bio: user.bio, avatar_url: user.avatar_url } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
