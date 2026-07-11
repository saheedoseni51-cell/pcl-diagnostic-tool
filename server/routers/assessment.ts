import { z } from "zod";
import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import {
  createAssessment,
  getAssessmentById,
  getUserAssessments,
  getSubmittedAssessments,
  updateAssessment,
  createAnswers,
  getAssessmentAnswers,
  createAssessmentScore,
  getAssessmentScore,
  logActivity,
} from "../db";
import { calculateScore } from "@shared/pcl-questions";
import { nanoid } from "nanoid";

/**
 * Assessment Router
 * Handles all assessment-related operations: creation, submission, scoring, and retrieval
 */
export const assessmentRouter = router({
  /**
   * Create or get a draft assessment for the current user
   */
  getDraft: protectedProcedure.query(async ({ ctx }) => {
    const assessments = await getUserAssessments(ctx.user.id);
    const draft = assessments.find((a) => a.status === "draft");
    return draft || null;
  }),

  /**
   * Create a new draft assessment
   */
  createDraft: protectedProcedure
    .input(
      z.object({
        participantName: z.string().optional(),
        organisation: z.string().optional(),
        unit: z.string().optional(),
        region: z.string().optional(),
        roleType: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assessmentId = `${ctx.user.id}-${nanoid()}`;

      const assessment = await createAssessment({
        id: assessmentId,
        userId: ctx.user.id,
        participantName: input.participantName || ctx.user.name || undefined,
        email: ctx.user.email || undefined,
        organisation: input.organisation || ctx.user.organisation || undefined,
        unit: input.unit || undefined,
        region: input.region || undefined,
        roleType: input.roleType || undefined,
        status: "draft",
      });

      // Log activity
      await logActivity({
        userId: ctx.user.id,
        userEmail: ctx.user.email || undefined,
        userName: ctx.user.name || undefined,
        action: "assessment_start",
        description: "Started a new assessment",
        details: `Assessment ID: ${assessmentId}`,
      });

      return { id: assessmentId };
    }),

  /**
   * Save answers to a draft assessment
   */
  saveAnswers: protectedProcedure
    .input(
      z.object({
        assessmentId: z.string(),
        answers: z.record(z.string(), z.number().min(1).max(5)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const assessment = await getAssessmentById(input.assessmentId);
      if (!assessment || assessment.userId !== ctx.user.id) {
        throw new Error("Assessment not found or access denied");
      }

      // Delete existing answers for this assessment
      const db = await (await import("../db")).getDb();
      if (db) {
        const { eq } = await import("drizzle-orm");
        const { answers: answersTable } = await import("../../drizzle/schema");
        await db.delete(answersTable).where(eq(answersTable.assessmentId, input.assessmentId));
      }

      // Insert new answers
      const answersList = Object.entries(input.answers).map(([questionCode, score]) => ({
        assessmentId: input.assessmentId,
        questionCode,
        score,
      }));

      if (answersList.length > 0) {
        await createAnswers(answersList);
      }

      // Update assessment timestamp
      await updateAssessment(input.assessmentId, {
        updatedAt: new Date(),
      });

      return { success: true };
    }),

  /**
   * Submit an assessment (calculate scores and mark as submitted)
   */
  submit: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const assessment = await getAssessmentById(input.assessmentId);
      if (!assessment || assessment.userId !== ctx.user.id) {
        throw new Error("Assessment not found or access denied");
      }

      // Get all answers
      const answersList = await getAssessmentAnswers(input.assessmentId);
      if (answersList.length !== 36) {
        throw new Error(`Assessment incomplete: ${answersList.length}/36 questions answered`);
      }

      // Convert answers to record format
      const answers: Record<string, number> = {};
      answersList.forEach((a) => {
        answers[a.questionCode] = a.score;
      });

      // Calculate scores
      const scoreResult = calculateScore(answers);

      // Save scores to database (convert to strings for decimal storage)
      const scoreData = {
        assessmentId: input.assessmentId,
        organisationGoals: scoreResult.organisationGoals.toString(),
        organisationStructure: scoreResult.organisationStructure.toString(),
        organisationManagement: scoreResult.organisationManagement.toString(),
        processGoals: scoreResult.processGoals.toString(),
        processStructure: scoreResult.processStructure.toString(),
        processManagement: scoreResult.processManagement.toString(),
        peopleGoals: scoreResult.peopleGoals.toString(),
        peopleStructure: scoreResult.peopleStructure.toString(),
        peopleManagement: scoreResult.peopleManagement.toString(),
        organisationAvg: scoreResult.organisationAvg.toString(),
        processAvg: scoreResult.processAvg.toString(),
        peopleAvg: scoreResult.peopleAvg.toString(),
        goalsAvg: scoreResult.goalsAvg.toString(),
        structureAvg: scoreResult.structureAvg.toString(),
        managementAvg: scoreResult.managementAvg.toString(),
        overallAvg: scoreResult.overallAvg.toString(),
        organisationPct: scoreResult.organisationPct.toString(),
        processPct: scoreResult.processPct.toString(),
        peoplePct: scoreResult.peoplePct.toString(),
        goalsPct: scoreResult.goalsPct.toString(),
        structurePct: scoreResult.structurePct.toString(),
        managementPct: scoreResult.managementPct.toString(),
        overallPct: scoreResult.overallPct.toString(),
      };
      await createAssessmentScore(scoreData as any);

      // Mark assessment as submitted
      await updateAssessment(input.assessmentId, {
        status: "submitted",
        submittedAt: new Date(),
      });

      // Log activity
      await logActivity({
        userId: ctx.user.id,
        userEmail: ctx.user.email || undefined,
        userName: ctx.user.name || undefined,
        action: "assessment_submit",
        description: "Submitted assessment",
        details: `Overall Score: ${scoreResult.overallPct.toFixed(1)}%`,
      });

      return { success: true, score: scoreResult };
    }),

  /**
   * Get the latest submitted assessment for the current user
   */
  getLatestSubmitted: protectedProcedure.query(async ({ ctx }) => {
    const assessments = await getUserAssessments(ctx.user.id);
    const submitted = assessments.filter((a) => a.status === "submitted").sort((a, b) => {
      const aTime = a.submittedAt?.getTime() || 0;
      const bTime = b.submittedAt?.getTime() || 0;
      return bTime - aTime;
    });
    return submitted[0] || null;
  }),

  /**
   * Get assessment with scores and answers
   */
  getWithDetails: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const assessment = await getAssessmentById(input.assessmentId);
      if (!assessment) {
        throw new Error("Assessment not found");
      }

      // Check access: user can see their own, admins can see all
      if (assessment.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Access denied");
      }

      const answers = await getAssessmentAnswers(input.assessmentId);
      const score = await getAssessmentScore(input.assessmentId);

      return {
        assessment,
        answers,
        score,
      };
    }),

  /**
   * Admin: Get all submitted assessments
   */
  getAllSubmitted: adminProcedure.query(async () => {
    return await getSubmittedAssessments();
  }),

  /**
   * Admin: Get assessment with all details
   */
  getAdminDetails: adminProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      const assessment = await getAssessmentById(input.assessmentId);
      if (!assessment) {
        throw new Error("Assessment not found");
      }

      const answers = await getAssessmentAnswers(input.assessmentId);
      const score = await getAssessmentScore(input.assessmentId);

      return {
        assessment,
        answers,
        score,
      };
    }),
});
