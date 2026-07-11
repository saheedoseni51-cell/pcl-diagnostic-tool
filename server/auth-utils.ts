import crypto from "crypto";

/**
 * Hash a password using PBKDF2
 * Uses Node.js built-in crypto module (no external dependencies)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, storedHash] = hash.split(":");
  if (!salt || !storedHash) return false;

  const computedHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return computedHash === storedHash;
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate initial admin credentials
 * Returns username and temporary password
 */
export function generateInitialAdminCredentials(): {
  username: string;
  temporaryPassword: string;
} {
  const username = "admin";
  // Generate a random 12-character password
  const temporaryPassword = crypto
    .randomBytes(9)
    .toString("hex")
    .substring(0, 12);

  return { username, temporaryPassword };
}
