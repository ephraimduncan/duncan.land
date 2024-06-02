-- Create user table
CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    github_id INTEGER NOT NULL UNIQUE,
    username TEXT NOT NULL,
    name TEXT,
    email TEXT NOT NULL UNIQUE
);

-- Create session table
CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create post table
CREATE TABLE IF NOT EXISTS post (
    id TEXT NOT NULL PRIMARY KEY,
    created_at INTEGER NOT NULL,
    message TEXT NOT NULL,
    user_id TEXT NOT NULL,
    signature TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
