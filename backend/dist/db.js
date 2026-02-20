"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool;
const getPool = () => {
    if (pool)
        return pool;
    const isProduction = process.env.NODE_ENV?.includes('production');
    const dbConfig = process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
        : {
            user: process.env.DB_USER || 'admin',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'finalcut_social',
            password: process.env.DB_PASSWORD || 'password',
            port: parseInt(process.env.DB_PORT || '5432'),
        };
    console.log(`Initializing pool with ${process.env.DATABASE_URL ? 'connection string' : 'params'}`);
    pool = new pg_1.Pool(dbConfig);
    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
    });
    return pool;
};
exports.getPool = getPool;
exports.default = {
    query: (text, params) => (0, exports.getPool)().query(text, params)
};
