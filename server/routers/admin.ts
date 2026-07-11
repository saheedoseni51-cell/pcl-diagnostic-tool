import { z } from "zod";
import { adminProcedure, router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getSubmittedAssessments, getAssessmentScore } from "../db";
import { isUserAdmin } from "../_core/admin-context";
import { TRPCError } from "@trpc/server";

/**
 * Admin Router
 * Admin-only endpoints for user management and score viewing
 */
export const adminRouter = router({
  /**
   * Admin: Get all users with their latest assessment scores
   * Accessible via OAuth admin role or admin token
   */
  getUsersWithScores: publicProcedure.query(async ({ ctx }) => {
    // Check if user is admin (either via OAuth or admin token)
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint",
      });
    }
    const db = await getDb();
    if (!db) return [];

    // Get all users
    const allUsers = await db.select().from(users);

    // Get all submitted assessments
    const assessments = await getSubmittedAssessments();

    // Map users to their latest assessment
    const usersWithScores = await Promise.all(
      allUsers.map(async (user) => {
        const userAssessments = assessments
          .filter((a) => a.userId === user.id)
          .sort((a, b) => {
            const aTime = a.submittedAt?.getTime() || 0;
            const bTime = b.submittedAt?.getTime() || 0;
            return bTime - aTime;
          });

        const latestAssessment = userAssessments[0];
        let score = null;

        if (latestAssessment) {
          score = await getAssessmentScore(latestAssessment.id);
        }

        return {
          user,
          latestAssessment,
          score,
          assessmentCount: userAssessments.length,
        };
      })
    );

    return usersWithScores;
  }),

  /**
   * Admin: Get detailed view of a specific user
   */
  getUserDetail: publicProcedure
    .input(z.object({ userId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      // Check if user is admin (either via OAuth or admin token)
      const isAdmin = await isUserAdmin(ctx);
      if (!isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can access this endpoint",
        });
      }
      const db = await getDb();
      if (!db) return null;

      // Get user
      const userResult = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      const user = userResult[0];

      if (!user) return null;

      // Get all assessments for this user
      const assessments = await getSubmittedAssessments();
      const userAssessments = assessments.filter((a) => a.userId === input.userId);

      // Get scores for all assessments
      const assessmentsWithScores = await Promise.all(
        userAssessments.map(async (assessment) => {
          const score = await getAssessmentScore(assessment.id);
          return { assessment, score };
        })
      );

      return {
        user,
        assessments: assessmentsWithScores,
      };
    }),

  /**
   * Admin: Get all users for the user list
   * Accessible via OAuth admin role or admin token
   */
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    // Check if user is admin (either via OAuth or admin token)
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint",
      });
    }
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(users);
  }),
});
