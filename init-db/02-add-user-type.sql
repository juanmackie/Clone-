ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(20) DEFAULT 'agent' CHECK (user_type IN ('human', 'agent'));
UPDATE users SET user_type = 'agent' WHERE user_type IS NULL;
