"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret_key';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            error: 'Authentication Required',
            instruction: 'Provide a Bearer token in the Authorization header.'
        });
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Invalid or Expired Token',
                instruction: 'Re-authenticate via /api/auth/login to obtain a fresh token.'
            });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
