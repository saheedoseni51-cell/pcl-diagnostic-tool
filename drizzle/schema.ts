import { pgTable, serial, varchar, text, timestamp, decimal, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  organisation: text("organisation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const assessments = pgTable("assessments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: integer("userId").notNull(),
  participantName: text("participantName"),
  email: varchar("email", { length: 320 }),
  organisation: text("organisation"),
  unit: text("unit"),
  region: text("region"),
  roleType: text("roleType"),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  submittedAt: timestamp("submittedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  assessmentId: varchar("assessmentId", { length: 64 }).notNull(),
  questionCode: varchar("questionCode", { length: 10 }).notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Answer = typeof answers.$inferSelect;
export type InsertAnswer = typeof answers.$inferInsert;

export const assessmentScores = pgTable("assessmentScores", {
  id: serial("id").primaryKey(),
  assessmentId: varchar("assessmentId", { length: 64 }).notNull(),
  organisationGoals: decimal("organisationGoals", { precision: 5, scale: 2 }),
  organisationStructure: decimal("organisationStructure", { precision: 5, scale: 2 }),
  organisationManagement: decimal("organisationManagement", { precision: 5, scale: 2 }),
  processGoals: decimal("processGoals", { precision: 5, scale: 2 }),
  processStructure: decimal("processStructure", { precision: 5, scale: 2 }),
  processManagement: decimal("processManagement", { precision: 5, scale: 2 }),
  peopleGoals: decimal("peopleGoals", { precision: 5, scale: 2 }),
  peopleStructure: decimal("peopleStructure", { precision: 5, scale: 2 }),
  peopleManagement: decimal("peopleManagement", { precision: 5, scale: 2 }),
  organisationAvg: decimal("organisationAvg", { precision: 5, scale: 2 }),
  processAvg: decimal("processAvg", { precision: 5, scale: 2 }),
  peopleAvg: decimal("peopleAvg", { precision: 5, scale: 2 }),
  goalsAvg: decimal("goalsAvg", { precision: 5, scale: 2 }),
  structureAvg: decimal("structureAvg", { precision: 5, scale: 2 }),
  managementAvg: decimal("managementAvg", { precision: 5, scale: 2 }),
  overallAvg: decimal("overallAvg", { precision: 5, scale: 2 }),
  organisationPct: decimal("organisationPct", { precision: 6, scale: 2 }),
  processPct: decimal("processPct", { precision: 6, scale: 2 }),
  peoplePct: decimal("peoplePct", { precision: 6, scale: 2 }),
  goalsPct: decimal("goalsPct", { precision: 6, scale: 2 }),
  structurePct: decimal("structurePct", { precision: 6, scale: 2 }),
  managementPct: decimal("managementPct", { precision: 6, scale: 2 }),
  overallPct: decimal("overallPct", { precision: 6, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssessmentScore = typeof assessmentScores.$inferSelect;
export type InsertAssessmentScore = typeof assessmentScores.$inferInsert;

export const activityLog = pgTable("activityLog", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  userEmail: varchar("userEmail", { length: 320 }),
  userName: text("userName"),
  action: varchar("action", { length: 64 }).notNull(),
  description: text("description"),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

export const adminSessions = pgTable("adminSessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  username: varchar("username", { length: 128 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  sessionToken: varchar("sessionToken", { length: 256 }).unique(),
  isFirstLogin: boolean("isFirstLogin").default(true).notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;
