import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getAdminByUsername,
  getAdminByToken,
  updateAdminPassword,
  updateAdminLastLogin,
  generateNewAdminSessionToken,
} from "../admin-db";
import { verifyPassword } from "../auth-utils";

/**
 * Admin authentication router
 * Handles admin login and password management
 */
export const adminAuthRouter = router({
  /**
   * Admin login with username and password
   */
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await getAdminByUsername(input.username);

      if (!admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      // Verify password
      const isValidPassword = verifyPassword(input.password, admin.passwordHash);
      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      // Update last login
      await updateAdminLastLogin(admin.id);

      // Generate new session token
      const sessionToken = await generateNewAdminSessionToken(admin.id);

      return {
        sessionToken,
        isFirstLogin: admin.isFirstLogin,
        username: admin.username,
      };
    }),

  /**
   * Verify admin session token
   */
  verify: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const admin = await getAdminByToken(input.token);

      if (!admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid session",
        });
      }

      return {
        id: admin.id,
        username: admin.username,
        isFirstLogin: admin.isFirstLogin,
      };
    }),

  /**
   * Change admin password (requires valid session)
   */
  changePassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      // Verify session
      const admin = await getAdminByToken(input.token);
      if (!admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid session",
        });
      }

      // Verify current password
      const isValidPassword = verifyPassword(
        input.currentPassword,
        admin.passwordHash
      );
      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      // Update password
      await updateAdminPassword(admin.id, input.newPassword);

      // Generate new session token
      const newSessionToken = await generateNewAdminSessionToken(admin.id);

      return {
        success: true,
        sessionToken: newSessionToken,
        message: "Password changed successfully",
      };
    }),

  /**
   * Get admin info from session token
   */
  getMe: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const admin = await getAdminByToken(input.token);

      if (!admin) {
        return null;
      }

      return {
        id: admin.id,
        username: admin.username,
        isFirstLogin: admin.isFirstLogin,
        lastLoginAt: admin.lastLoginAt,
      };
    }),
});
