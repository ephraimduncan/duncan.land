-- Create user table
CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    github_id INTEGER NOT NULL UNIQUE,
    username TEXT NOT NULL,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER DEFAULT 0,
    image TEXT,
    createdAt INTEGER DEFAULT (strftime('%s', 'now')),
    updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Create session table (Better Auth schema)
CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expiresAt INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
);

-- Create account table for OAuth (Better Auth schema)
CREATE TABLE IF NOT EXISTS account (
    id TEXT NOT NULL PRIMARY KEY,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    accessTokenExpiresAt INTEGER,
    refreshTokenExpiresAt INTEGER,
    scope TEXT,
    password TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
);

-- Create post table
CREATE TABLE IF NOT EXISTS post (
    id TEXT NOT NULL PRIMARY KEY,
    created_at INTEGER NOT NULL,
    message TEXT NOT NULL,
    user_id TEXT NOT NULL UNIQUE,
    signature TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create verification table (Better Auth schema)
CREATE TABLE IF NOT EXISTS verification (
    id TEXT NOT NULL PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt INTEGER NOT NULL,
    createdAt INTEGER,
    updatedAt INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_account_userId ON account(userId);
CREATE UNIQUE INDEX IF NOT EXISTS idx_account_provider ON account(providerId, accountId);
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
