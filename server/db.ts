import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, assessments, InsertAssessment, answers, InsertAnswer, assessmentScores, InsertAssessmentScore, activityLog, InsertActivityLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      const client = postgres(ENV.databaseUrl, { prepare: false });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const existing = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);

    if (existing.length > 0) {
      const updateSet: Record<string, unknown> = {};

      const textFields = ["name", "email", "loginMethod"] as const;
      type TextField = (typeof textFields)[number];

      const assignNullable = (field: TextField) => {
        const value = user[field];
        if (value === undefined) return;
        updateSet[field] = value ?? null;
      };

      textFields.forEach(assignNullable);

      if (user.lastSignedIn !== undefined) {
        updateSet.lastSignedIn = user.lastSignedIn;
      }
      if (user.role !== undefined) {
        updateSet.role = user.role;
      }

      updateSet.updatedAt = new Date();

      await db.update(users).set(updateSet).where(eq(users.openId, user.openId));
    } else {
      const values: InsertUser = {
        openId: user.openId,
      };

      const textFields = ["name", "email", "loginMethod"] as const;
      type TextField = (typeof textFields)[number];

      const assignNullable = (field: TextField) => {
        const value = user[field];
        if (value === undefined) return;
        values[field] = value ?? null;
      };

      textFields.forEach(assignNullable);

      values.lastSignedIn = user.lastSignedIn || new Date();
      values.role = user.role || (user.openId === ENV.ownerOpenId ? 'admin' : 'user');

      await db.insert(users).values(values);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createAssessment(assessment: InsertAssessment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(assessments).values(assessment);
}

export async function getAssessmentById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return result[0];
}

export async function getUserAssessments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assessments).where(eq(assessments.userId, userId));
}

export async function getSubmittedAssessments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assessments).where(eq(assessments.status, "submitted"));
}

export async function updateAssessment(id: string, data: Partial<InsertAssessment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(assessments).set(data).where(eq(assessments.id, id));
}

export async function createAnswers(answers_list: InsertAnswer[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(answers).values(answers_list);
}

export async function getAssessmentAnswers(assessmentId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(answers).where(eq(answers.assessmentId, assessmentId));
}

export async function createAssessmentScore(score: InsertAssessmentScore) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(assessmentScores).values(score);
}

export async function getAssessmentScore(assessmentId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(assessmentScores).where(eq(assessmentScores.assessmentId, assessmentId)).limit(1);
  return result[0];
}

export async function logActivity(activity: InsertActivityLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(activityLog).values(activity);
}

export async function getActivityLog(limit: number = 1000) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activityLog).orderBy(desc(activityLog.timestamp)).limit(limit);
}

export async function getUserActivityLog(userId: number, limit: number = 500) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activityLog).where(eq(activityLog.userId, userId)).orderBy(desc(activityLog.timestamp)).limit(limit);
}
