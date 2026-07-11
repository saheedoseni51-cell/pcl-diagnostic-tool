import { describe, it, expect, beforeAll } from "vitest";
import {
  createAdminSession,
  getAdminByUsername,
  getAdminByToken,
  updateAdminPassword,
  updateAdminLastLogin,
  generateNewAdminSessionToken,
} from "./admin-db";
import { verifyPassword, hashPassword } from "./auth-utils";

describe("Admin Authentication", () => {
  let testAdminId: string;
  let testSessionToken: string;
  const testUsername = `admin-test-${Date.now()}`;
  const testPassword = "TestPassword123!";
  const newPassword = "NewPassword456!";

  beforeAll(async () => {
    // Create a test admin session
    testSessionToken = await createAdminSession(testUsername, testPassword);
    const admin = await getAdminByUsername(testUsername);
    if (admin) {
      testAdminId = admin.id;
    }
  });

  describe("createAdminSession", () => {
    it("should create a new admin session with hashed password", async () => {
      const token = await createAdminSession(
        `admin-new-${Date.now()}`,
        "SecurePass123!"
      );
      expect(token).toBeTruthy();
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe("getAdminByUsername", () => {
    it("should retrieve admin by username", async () => {
      const admin = await getAdminByUsername(testUsername);
      expect(admin).toBeTruthy();
      expect(admin?.username).toBe(testUsername);
      expect(admin?.isFirstLogin).toBe(true);
    });

    it("should return null for non-existent username", async () => {
      const admin = await getAdminByUsername("nonexistent-admin-xyz");
      expect(admin).toBeNull();
    });
  });

  describe("getAdminByToken", () => {
    it("should retrieve admin by valid session token", async () => {
      const admin = await getAdminByToken(testSessionToken);
      expect(admin).toBeTruthy();
      expect(admin?.username).toBe(testUsername);
    });

    it("should return null for invalid token", async () => {
      const admin = await getAdminByToken("invalid-token-xyz");
      expect(admin).toBeNull();
    });
  });

  describe("Password verification", () => {
    it("should correctly verify valid password", async () => {
      const admin = await getAdminByUsername(testUsername);
      expect(admin).toBeTruthy();
      if (admin) {
        const isValid = verifyPassword(testPassword, admin.passwordHash);
        expect(isValid).toBe(true);
      }
    });

    it("should reject invalid password", async () => {
      const admin = await getAdminByUsername(testUsername);
      expect(admin).toBeTruthy();
      if (admin) {
        const isValid = verifyPassword("WrongPassword123!", admin.passwordHash);
        expect(isValid).toBe(false);
      }
    });
  });

  describe("updateAdminPassword", () => {
    it("should update admin password and clear first login flag", async () => {
      await updateAdminPassword(testAdminId, newPassword);

      const admin = await getAdminByUsername(testUsername);
      expect(admin).toBeTruthy();
      if (admin) {
        expect(admin.isFirstLogin).toBe(false);
        const isValid = verifyPassword(newPassword, admin.passwordHash);
        expect(isValid).toBe(true);
      }
    });
  });

  describe("updateAdminLastLogin", () => {
    it("should update last login timestamp", async () => {
      const beforeUpdate = new Date();
      await updateAdminLastLogin(testAdminId);
      const afterUpdate = new Date();

      const admin = await getAdminByUsername(testUsername);
      expect(admin).toBeTruthy();
      if (admin && admin.lastLoginAt) {
        // Allow for database timestamp precision (MySQL stores to second precision)
        expect(admin.lastLoginAt.getTime()).toBeGreaterThanOrEqual(
          beforeUpdate.getTime() - 1000
        );
        expect(admin.lastLoginAt.getTime()).toBeLessThanOrEqual(
          afterUpdate.getTime() + 1000
        );
      }
    });
  });

  describe("generateNewAdminSessionToken", () => {
    it("should generate a new session token", async () => {
      const oldToken = testSessionToken;
      const newToken = await generateNewAdminSessionToken(testAdminId);

      expect(newToken).toBeTruthy();
      expect(newToken).not.toBe(oldToken);
      expect(newToken.length).toBeGreaterThan(0);

      // Old token should no longer work
      const adminWithOldToken = await getAdminByToken(oldToken);
      expect(adminWithOldToken).toBeNull();

      // New token should work
      const adminWithNewToken = await getAdminByToken(newToken);
      expect(adminWithNewToken).toBeTruthy();
      expect(adminWithNewToken?.username).toBe(testUsername);
    });
  });

  describe("Password hashing", () => {
    it("should hash passwords securely", () => {
      const password = "TestPassword123!";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      // Same password should produce different hashes (due to different salts)
      expect(hash1).not.toBe(hash2);

      // Both hashes should verify with the original password
      expect(verifyPassword(password, hash1)).toBe(true);
      expect(verifyPassword(password, hash2)).toBe(true);
    });

    it("should not verify incorrect password", () => {
      const password = "TestPassword123!";
      const hash = hashPassword(password);

      expect(verifyPassword("WrongPassword", hash)).toBe(false);
      expect(verifyPassword("", hash)).toBe(false);
    });
  });
});
