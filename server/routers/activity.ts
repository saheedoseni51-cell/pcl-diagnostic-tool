import { z } from "zod";
import { adminProcedure, router, publicProcedure } from "../_core/trpc";
import { getActivityLog, getUserActivityLog } from "../db";
import { isUserAdmin } from "../_core/admin-context";
import { TRPCError } from "@trpc/server";

/**
 * Activity Router
 * Admin-only endpoints for viewing activity logs
 */
export const activityRouter = router({
  /**
   * Admin: Get all activity logs (most recent first)
   * Accessible via OAuth admin role or admin token
   */
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(5000).default(1000),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user is admin (either via OAuth or admin token)
      const isAdmin = await isUserAdmin(ctx);
      if (!isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can access this endpoint",
        });
      }
      return await getActivityLog(input.limit);
    }),

  /**
   * Admin: Get activity logs for a specific user
   * Accessible via OAuth admin role or admin token
   */
  getByUser: publicProcedure
    .input(
      z.object({
        userId: z.number().int().positive(),
        limit: z.number().int().positive().max(5000).default(500),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if user is admin (either via OAuth or admin token)
      const isAdmin = await isUserAdmin(ctx);
      if (!isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can access this endpoint",
        });
      }
      return await getUserActivityLog(input.userId, input.limit);
    }),

  /**
   * Admin: Get summary stats for activity dashboard
   * Accessible via OAuth admin role or admin token
   */
  getSummary: publicProcedure.query(async ({ ctx }) => {
    // Check if user is admin (either via OAuth or admin token)
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint",
      });
    }
    const allLogs = await getActivityLog(10000);

    // Count by action type
    const actionCounts: Record<string, number> = {};
    allLogs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });

    // Count unique users
    const uniqueUsers = new Set(allLogs.map((log) => log.userId)).size;

    // Get recent logins and logouts
    const logins = allLogs.filter((log) => log.action === "login").slice(0, 50);
    const logouts = allLogs.filter((log) => log.action === "logout").slice(0, 50);

    return {
      totalActivities: allLogs.length,
      actionCounts,
      uniqueUsers,
      recentLogins: logins,
      recentLogouts: logouts,
    };
  }),
});
