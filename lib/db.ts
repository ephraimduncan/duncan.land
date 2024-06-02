import { createClient } from "@libsql/client";

export const db = createClient({
    url: "file:local.db",
});

export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export interface DatabaseUser {
    id: string;
    username: string;
    github_id: number;
    name?: string;
    email: string;
}
