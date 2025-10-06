import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create database connection lazily to avoid build-time errors
let _db: ReturnType<typeof drizzle> | null = null;

function getDatabase() {
  if (!_db) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      // During build time or when DATABASE_URL is missing, return null
      // This prevents build-time errors during static generation
      return null;
    }
    const sql = neon(dbUrl);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const database = getDatabase();
    if (!database) {
      throw new Error('Database not configured - DATABASE_URL is missing');
    }
    return (database as Record<string, unknown>)[prop];
  }
});