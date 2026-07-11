import { z } from "zod";
import { protectedProcedure, router, publicProcedure } from "../_core/trpc";
import { getAssessmentScore } from "../db";
import { getAllRecommendations } from "@shared/recommendations";
import { isUserAdmin } from "../_core/admin-context";
import { TRPCError } from "@trpc/server";

/**
 * Recommendations Router
 * Handles fetching personalized recommendations based on assessment scores
 */
export const recommendationsRouter = router({
  /**
   * Get recommendations for a specific assessment
   * Accessible to assessment owner or admins
   */
  getForAssessment: publicProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const { getAssessmentById } = await import("../db");
      const assessment = await getAssessmentById(input.assessmentId);

      if (!assessment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assessment not found",
        });
      }

      // Check if user owns the assessment or is admin (via OAuth or token)
      const isAdmin = await isUserAdmin(ctx);
      const isOwner = ctx.user && assessment.userId === ctx.user.id;

      if (!isOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      const score = await getAssessmentScore(input.assessmentId);

      if (!score) {
        throw new Error("Assessment score not found");
      }

      // Convert string scores back to numbers for recommendations engine
      const scores = {
        organisationGoals: parseFloat(score.organisationGoals || "0"),
        organisationStructure: parseFloat(score.organisationStructure || "0"),
        organisationManagement: parseFloat(score.organisationManagement || "0"),
        processGoals: parseFloat(score.processGoals || "0"),
        processStructure: parseFloat(score.processStructure || "0"),
        processManagement: parseFloat(score.processManagement || "0"),
        peopleGoals: parseFloat(score.peopleGoals || "0"),
        peopleStructure: parseFloat(score.peopleStructure || "0"),
        peopleManagement: parseFloat(score.peopleManagement || "0"),
      };

      const recommendations = getAllRecommendations(scores);

      return {
        assessmentId: input.assessmentId,
        recommendations,
        generatedAt: new Date(),
      };
    }),

  /**
   * Get recommendations for the latest submitted assessment
   */
  getForLatestAssessment: protectedProcedure.query(async ({ ctx }) => {
    const { getUserAssessments } = await import("../db");
    const assessments = await getUserAssessments(ctx.user.id);

    // Find latest submitted assessment
    const submitted = assessments
      .filter((a) => a.status === "submitted")
      .sort((a, b) => {
        const aTime = a.submittedAt?.getTime() || 0;
        const bTime = b.submittedAt?.getTime() || 0;
        return bTime - aTime;
      });

    if (!submitted.length) {
      return null;
    }

    const latestAssessment = submitted[0];
    const score = await getAssessmentScore(latestAssessment.id);

    if (!score) {
      throw new Error("Assessment score not found");
    }

    // Convert string scores back to numbers
    const scores = {
      organisationGoals: parseFloat(score.organisationGoals || "0"),
      organisationStructure: parseFloat(score.organisationStructure || "0"),
      organisationManagement: parseFloat(score.organisationManagement || "0"),
      processGoals: parseFloat(score.processGoals || "0"),
      processStructure: parseFloat(score.processStructure || "0"),
      processManagement: parseFloat(score.processManagement || "0"),
      peopleGoals: parseFloat(score.peopleGoals || "0"),
      peopleStructure: parseFloat(score.peopleStructure || "0"),
      peopleManagement: parseFloat(score.peopleManagement || "0"),
    };

    const recommendations = getAllRecommendations(scores);

    return {
      assessmentId: latestAssessment.id,
      recommendations,
      generatedAt: new Date(),
    };
  }),
});
