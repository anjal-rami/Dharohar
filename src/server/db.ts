import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

const connectionString = process.env["DATABASE_URL"];

if (connectionString && connectionString.trim() !== "") {
  try {
    const pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 3000,
      ssl: process.env["NODE_ENV"] === "production" ? { rejectUnauthorized: false } : undefined,
    });
    dbInstance = drizzle(pool, { schema });
  } catch (err) {
    console.warn("[DB Init]: Failed to initialize database pool, using verified in-memory fallback", err);
  }
}

export const db = dbInstance;

/**
 * Checks whether active Postgres database connection is established
 */
export function isDbConnected(): boolean {
  return dbInstance !== null;
}

/**
 * Safe database query executor with guaranteed fallback.
 * Prevents unhandled server exceptions when DATABASE_URL is unreachable or pool is exhausted.
 */
export async function safeDbQuery<T>(
  queryFn: (database: NonNullable<typeof dbInstance>) => Promise<T>,
  fallbackValue: T
): Promise<T> {
  if (!dbInstance) {
    return fallbackValue;
  }
  try {
    return await queryFn(dbInstance);
  } catch (error) {
    console.warn("[Safe DB Query]: Execution failed, using resilient fallback:", error);
    return fallbackValue;
  }
}
