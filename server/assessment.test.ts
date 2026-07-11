import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// Mock authenticated user context
function createAuthContext(user: User): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// Mock admin user context
function createAdminContext(): TrpcContext {
  const adminUser: User = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return createAuthContext(adminUser);
}

// Mock regular user context
function createUserContext(): TrpcContext {
  const regularUser: User = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return createAuthContext(regularUser);
}

describe("Assessment API Endpoints", () => {
  describe("assessment.createDraft", () => {
    it("should create a draft assessment for authenticated users", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.assessment.createDraft({
        participantName: "John Doe",
        organisation: "Acme Corp",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.id).toMatch(/^2-/);
    });

    it("should reject unauthenticated users", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: {} as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.assessment.createDraft({
          participantName: "John Doe",
          organisation: "Acme Corp",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("assessment.saveAnswers", () => {
    it("should save answers to an assessment", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      // Create draft first
      const draftResult = await caller.assessment.createDraft({
        participantName: "John Doe",
        organisation: "Acme Corp",
      });
      const draft = { id: draftResult.id };

      // Save answers
      const answers: Record<string, number> = {};
      for (let i = 0; i < 36; i++) {
        answers[`q${i}`] = 3;
      }

      const result = await caller.assessment.saveAnswers({
        assessmentId: draft.id,
        answers,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("should reject saving answers to someone else's assessment", async () => {
      const ctx1 = createUserContext();
      const ctx2 = createUserContext();
      ctx2.user!.id = 999; // Different user ID

      const caller1 = appRouter.createCaller(ctx1);
      const caller2 = appRouter.createCaller(ctx2);

      // User 1 creates draft
      const draft = await caller1.assessment.createDraft({
        participantName: "John Doe",
        organisation: "Acme Corp",
      });

      // User 2 tries to save answer
      try {
        const answers: Record<string, number> = {};
        for (let i = 0; i < 36; i++) {
          answers[`q${i}`] = 3;
        }

        await caller2.assessment.saveAnswers({
          assessmentId: draft.id,
          answers,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("not found or access denied");
      }
    });
  });

  describe("assessment.submit", () => {
    it("should submit an assessment with all answers", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      // Create draft
      const draft = await caller.assessment.createDraft({
        participantName: "John Doe",
        organisation: "Acme Corp",
      });

      // Save all 36 answers
      const answers: Record<string, number> = {};
      for (let i = 0; i < 36; i++) {
        answers[`q${i}`] = 3;
      }

      await caller.assessment.saveAnswers({
        assessmentId: draft.id,
        answers,
      });

      // Submit assessment
      const result = await caller.assessment.submit({
        assessmentId: draft.id,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.score).toBeDefined();
    });

    it("should reject submitting assessment without all answers", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      // Create draft but don't save any answers
      const draft = await caller.assessment.createDraft({
        participantName: "John Doe",
        organisation: "Acme Corp",
      });

      // Try to submit
      try {
        await caller.assessment.submit({
          assessmentId: draft.id,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Assessment incomplete");
      }
    });
  });

  describe("assessment.getLatestSubmitted", () => {
    it("should return latest submitted assessment for user", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      // Create and submit assessment
      const draft = await caller.assessment.createDraft({
        participantName: "John Doe",
        organisation: "Acme Corp",
      });

      // Save all answers
      const answers: Record<string, number> = {};
      for (let i = 0; i < 36; i++) {
        answers[`q${i}`] = 3;
      }

      await caller.assessment.saveAnswers({
        assessmentId: draft.id,
        answers,
      });

      // Submit
      const submitResult = await caller.assessment.submit({
        assessmentId: draft.id,
      });

      expect(submitResult.success).toBe(true);

      // Get latest
      const result = await caller.assessment.getLatestSubmitted();

      expect(result).toBeDefined();
      expect(result!.id).toBe(draft.id);
      expect(result!.status).toBe("submitted");
    });

    it("should return assessment for user with submitted assessments", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.assessment.getLatestSubmitted();

      // Result should be either null (no assessments) or an assessment object
      if (result) {
        expect(result.userId).toBe(ctx.user!.id);
        expect(result.status).toBe("submitted");
      }
    });
  });

  describe("assessment.getWithDetails", () => {
    it("should return assessment with answers and scores", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      // Create and submit assessment
      const draft = await caller.assessment.createDraft({
        participantName: "John Doe",
        organisation: "Acme Corp",
      });

      // Save all answers
      const answers: Record<string, number> = {};
      for (let i = 0; i < 36; i++) {
        answers[`q${i}`] = 3;
      }

      await caller.assessment.saveAnswers({
        assessmentId: draft.id,
        answers,
      });

      // Submit
      await caller.assessment.submit({
        assessmentId: draft.id,
      });

      // Get details
      const result = await caller.assessment.getWithDetails({
        assessmentId: draft.id,
      });

      expect(result).toBeDefined();
      expect(result.assessment).toBeDefined();
      expect(result.answers).toBeDefined();
      expect(result.score).toBeDefined();
    });
  });
});

describe("Admin API Endpoints", () => {
  describe("admin.getAllUsers", () => {
    it("should allow admin to get all users", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getAllUsers();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject non-admin users", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.getAllUsers();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("admin.getUsersWithScores", () => {
    it("should allow admin to get users with scores", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getUsersWithScores();

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("user");
        expect(result[0]).toHaveProperty("score");
        expect(result[0]).toHaveProperty("assessmentCount");
      }
    });

    it("should reject non-admin users", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.getUsersWithScores();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});

describe("Activity API Endpoints", () => {
  describe("activity.getAll", () => {
    it("should allow admin to get activity logs", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.activity.getAll({ limit: 100 });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject non-admin users", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.activity.getAll({ limit: 100 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
