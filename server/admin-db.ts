import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { adminSessions } from "../drizzle/schema";
import { getDb } from "./db";
import { hashPassword, generateSessionToken } from "./auth-utils";

/**
 * Create initial admin session with username and password
 */
export async function createAdminSession(
  username: string,
  password: string
): Promise<string> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const id = nanoid();
  const passwordHash = hashPassword(password);
  const sessionToken = generateSessionToken();

  await db.insert(adminSessions).values({
    id,
    username,
    passwordHash,
    sessionToken,
    isFirstLogin: true,
  });

  return sessionToken;
}

/**
 * Get admin session by username
 */
export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(adminSessions)
    .where(eq(adminSessions.username, username))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get admin session by token
 */
export async function getAdminByToken(token: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(adminSessions)
    .where(eq(adminSessions.sessionToken, token))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update admin password and clear first login flag
 */
export async function updateAdminPassword(
  adminId: string,
  newPassword: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const passwordHash = hashPassword(newPassword);

  await db
    .update(adminSessions)
    .set({
      passwordHash,
      isFirstLogin: false,
      updatedAt: new Date(),
    })
    .where(eq(adminSessions.id, adminId));
}

/**
 * Update admin last login timestamp
 */
export async function updateAdminLastLogin(adminId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(adminSessions)
    .set({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(adminSessions.id, adminId));
}

/**
 * Generate new session token for admin
 */
export async function generateNewAdminSessionToken(
  adminId: string
): Promise<string> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const newToken = generateSessionToken();

  await db
    .update(adminSessions)
    .set({
      sessionToken: newToken,
      updatedAt: new Date(),
    })
    .where(eq(adminSessions.id, adminId));

  return newToken;
}
