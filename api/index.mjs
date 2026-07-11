var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activityLog: () => activityLog,
  adminSessions: () => adminSessions,
  answers: () => answers,
  assessmentScores: () => assessmentScores,
  assessments: () => assessments,
  users: () => users
});
import { pgTable, serial, varchar, text, timestamp, decimal, integer, boolean } from "drizzle-orm/pg-core";
var users, assessments, answers, assessmentScores, activityLog, adminSessions;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: varchar("role", { length: 20 }).default("user").notNull(),
      organisation: text("organisation"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    assessments = pgTable("assessments", {
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
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    answers = pgTable("answers", {
      id: serial("id").primaryKey(),
      assessmentId: varchar("assessmentId", { length: 64 }).notNull(),
      questionCode: varchar("questionCode", { length: 10 }).notNull(),
      score: integer("score").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    assessmentScores = pgTable("assessmentScores", {
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
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    activityLog = pgTable("activityLog", {
      id: serial("id").primaryKey(),
      userId: integer("userId").notNull(),
      userEmail: varchar("userEmail", { length: 320 }),
      userName: text("userName"),
      action: varchar("action", { length: 64 }).notNull(),
      description: text("description"),
      details: text("details"),
      timestamp: timestamp("timestamp").defaultNow().notNull()
    });
    adminSessions = pgTable("adminSessions", {
      id: varchar("id", { length: 64 }).primaryKey(),
      username: varchar("username", { length: 128 }).notNull().unique(),
      passwordHash: text("passwordHash").notNull(),
      sessionToken: varchar("sessionToken", { length: 256 }).unique(),
      isFirstLogin: boolean("isFirstLogin").default(true).notNull(),
      lastLoginAt: timestamp("lastLoginAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      supabaseUrl: process.env.SUPABASE_URL ?? "",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  createAnswers: () => createAnswers,
  createAssessment: () => createAssessment,
  createAssessmentScore: () => createAssessmentScore,
  getActivityLog: () => getActivityLog,
  getAssessmentAnswers: () => getAssessmentAnswers,
  getAssessmentById: () => getAssessmentById,
  getAssessmentScore: () => getAssessmentScore,
  getDb: () => getDb,
  getSubmittedAssessments: () => getSubmittedAssessments,
  getUserActivityLog: () => getUserActivityLog,
  getUserAssessments: () => getUserAssessments,
  getUserByOpenId: () => getUserByOpenId,
  logActivity: () => logActivity,
  updateAssessment: () => updateAssessment,
  upsertUser: () => upsertUser
});
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
async function getDb() {
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
async function upsertUser(user) {
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
      const updateSet = {};
      const textFields = ["name", "email", "loginMethod"];
      const assignNullable = (field) => {
        const value = user[field];
        if (value === void 0) return;
        updateSet[field] = value ?? null;
      };
      textFields.forEach(assignNullable);
      if (user.lastSignedIn !== void 0) {
        updateSet.lastSignedIn = user.lastSignedIn;
      }
      if (user.role !== void 0) {
        updateSet.role = user.role;
      }
      updateSet.updatedAt = /* @__PURE__ */ new Date();
      await db.update(users).set(updateSet).where(eq(users.openId, user.openId));
    } else {
      const values = {
        openId: user.openId
      };
      const textFields = ["name", "email", "loginMethod"];
      const assignNullable = (field) => {
        const value = user[field];
        if (value === void 0) return;
        values[field] = value ?? null;
      };
      textFields.forEach(assignNullable);
      values.lastSignedIn = user.lastSignedIn || /* @__PURE__ */ new Date();
      values.role = user.role || (user.openId === ENV.ownerOpenId ? "admin" : "user");
      await db.insert(users).values(values);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createAssessment(assessment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(assessments).values(assessment);
}
async function getAssessmentById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return result[0];
}
async function getUserAssessments(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assessments).where(eq(assessments.userId, userId));
}
async function getSubmittedAssessments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assessments).where(eq(assessments.status, "submitted"));
}
async function updateAssessment(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(assessments).set(data).where(eq(assessments.id, id));
}
async function createAnswers(answers_list) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(answers).values(answers_list);
}
async function getAssessmentAnswers(assessmentId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(answers).where(eq(answers.assessmentId, assessmentId));
}
async function createAssessmentScore(score) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(assessmentScores).values(score);
}
async function getAssessmentScore(assessmentId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(assessmentScores).where(eq(assessmentScores.assessmentId, assessmentId)).limit(1);
  return result[0];
}
async function logActivity(activity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(activityLog).values(activity);
}
async function getActivityLog(limit = 1e3) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activityLog).orderBy(desc(activityLog.timestamp)).limit(limit);
}
async function getUserActivityLog(userId, limit = 500) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activityLog).where(eq(activityLog.userId, userId)).orderBy(desc(activityLog.timestamp)).limit(limit);
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// api/_index.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
init_env();
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/assessment.ts
import { z as z2 } from "zod";
init_db();

// shared/pcl-questions.ts
var SECTIONS = [
  {
    key: "Goals",
    questions: ["O1", "O2", "O3", "O4", "P1", "P2", "P3", "P4", "Pe1", "Pe2", "Pe3", "Pe4"]
  },
  {
    key: "Structure",
    questions: ["O5", "O6", "O7", "O8", "P5", "P6", "P7", "P8", "Pe5", "Pe6", "Pe7", "Pe8"]
  },
  {
    key: "Management",
    questions: ["O9", "O10", "O11", "O12", "P9", "P10", "P11", "P12", "Pe9", "Pe10", "Pe11", "Pe12"]
  }
];
var DIMENSION_CATEGORIES = {
  O1: {
    key: "O1",
    questions: ["O1", "O2", "O3", "O4"],
    theme: "Organisation Goals"
  },
  O2: {
    key: "O2",
    questions: ["O5", "O6", "O7", "O8"],
    theme: "Organisation Structure"
  },
  O3: {
    key: "O3",
    questions: ["O9", "O10", "O11", "O12"],
    theme: "Organisation Management"
  },
  P1: {
    key: "P1",
    questions: ["P1", "P2", "P3", "P4"],
    theme: "Process Goals"
  },
  P2: {
    key: "P2",
    questions: ["P5", "P6", "P7", "P8"],
    theme: "Process Structure"
  },
  P3: {
    key: "P3",
    questions: ["P9", "P10", "P11", "P12"],
    theme: "Process Management"
  },
  Pe1: {
    key: "Pe1",
    questions: ["Pe1", "Pe2", "Pe3", "Pe4"],
    theme: "People Goals"
  },
  Pe2: {
    key: "Pe2",
    questions: ["Pe5", "Pe6", "Pe7", "Pe8"],
    theme: "People Structure"
  },
  Pe3: {
    key: "Pe3",
    questions: ["Pe9", "Pe10", "Pe11", "Pe12"],
    theme: "People Management"
  }
};
var MATURITY_BANDS = [
  { label: "Nascent", color: "#8e2a68", minAvg: 1, maxAvg: 2 },
  { label: "Emerging", color: "#b85f2e", minAvg: 2, maxAvg: 3 },
  { label: "Established", color: "#c59412", minAvg: 3, maxAvg: 4 },
  { label: "Advanced", color: "#2d7f71", minAvg: 4, maxAvg: 4.5 },
  { label: "Leading", color: "#2f6f2f", minAvg: 4.5, maxAvg: 5 }
];
function getMaturityBand(avg) {
  if (avg < 2) return MATURITY_BANDS[0];
  if (avg < 3) return MATURITY_BANDS[1];
  if (avg < 4) return MATURITY_BANDS[2];
  if (avg < 4.5) return MATURITY_BANDS[3];
  return MATURITY_BANDS[4];
}
function calculateScore(answers2) {
  const cells = Object.entries(DIMENSION_CATEGORIES).map(([cellKey, category]) => {
    const avg = category.questions.reduce((sum, qCode) => sum + (answers2[qCode] || 0), 0) / category.questions.length;
    const band = getMaturityBand(avg);
    const pct = (avg - 1) / 4 * 100;
    return {
      cell: cellKey,
      theme: category.theme,
      avg,
      pct,
      label: band.label,
      color: band.color
    };
  });
  const organisationCells = cells.filter((c) => c.cell.startsWith("O"));
  const processCells = cells.filter((c) => c.cell.startsWith("P"));
  const peopleCells = cells.filter((c) => c.cell.startsWith("Pe"));
  const organisationAvg = organisationCells.reduce((sum, c) => sum + c.avg, 0) / organisationCells.length;
  const processAvg = processCells.reduce((sum, c) => sum + c.avg, 0) / processCells.length;
  const peopleAvg = peopleCells.reduce((sum, c) => sum + c.avg, 0) / peopleCells.length;
  const goalsCodes = SECTIONS[0].questions;
  const structureCodes = SECTIONS[1].questions;
  const managementCodes = SECTIONS[2].questions;
  const goalsAvg = goalsCodes.reduce((sum, qCode) => sum + (answers2[qCode] || 0), 0) / goalsCodes.length;
  const structureAvg = structureCodes.reduce((sum, qCode) => sum + (answers2[qCode] || 0), 0) / structureCodes.length;
  const managementAvg = managementCodes.reduce((sum, qCode) => sum + (answers2[qCode] || 0), 0) / managementCodes.length;
  const overallAvg = cells.reduce((sum, c) => sum + c.avg, 0) / cells.length;
  const pctFromAvg = (avg) => (avg - 1) / 4 * 100;
  return {
    cells,
    organisationGoals: cells.find((c) => c.cell === "O1")?.avg || 0,
    organisationStructure: cells.find((c) => c.cell === "O2")?.avg || 0,
    organisationManagement: cells.find((c) => c.cell === "O3")?.avg || 0,
    processGoals: cells.find((c) => c.cell === "P1")?.avg || 0,
    processStructure: cells.find((c) => c.cell === "P2")?.avg || 0,
    processManagement: cells.find((c) => c.cell === "P3")?.avg || 0,
    peopleGoals: cells.find((c) => c.cell === "Pe1")?.avg || 0,
    peopleStructure: cells.find((c) => c.cell === "Pe2")?.avg || 0,
    peopleManagement: cells.find((c) => c.cell === "Pe3")?.avg || 0,
    organisationAvg,
    processAvg,
    peopleAvg,
    goalsAvg,
    structureAvg,
    managementAvg,
    overallAvg,
    organisationPct: pctFromAvg(organisationAvg),
    processPct: pctFromAvg(processAvg),
    peoplePct: pctFromAvg(peopleAvg),
    goalsPct: pctFromAvg(goalsAvg),
    structurePct: pctFromAvg(structureAvg),
    managementPct: pctFromAvg(managementAvg),
    overallPct: pctFromAvg(overallAvg)
  };
}

// server/routers/assessment.ts
import { nanoid } from "nanoid";
var assessmentRouter = router({
  /**
   * Create or get a draft assessment for the current user
   */
  getDraft: protectedProcedure.query(async ({ ctx }) => {
    const assessments2 = await getUserAssessments(ctx.user.id);
    const draft = assessments2.find((a) => a.status === "draft");
    return draft || null;
  }),
  /**
   * Create a new draft assessment
   */
  createDraft: protectedProcedure.input(
    z2.object({
      participantName: z2.string().optional(),
      organisation: z2.string().optional(),
      unit: z2.string().optional(),
      region: z2.string().optional(),
      roleType: z2.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const assessmentId = `${ctx.user.id}-${nanoid()}`;
    const assessment = await createAssessment({
      id: assessmentId,
      userId: ctx.user.id,
      participantName: input.participantName || ctx.user.name || void 0,
      email: ctx.user.email || void 0,
      organisation: input.organisation || ctx.user.organisation || void 0,
      unit: input.unit || void 0,
      region: input.region || void 0,
      roleType: input.roleType || void 0,
      status: "draft"
    });
    await logActivity({
      userId: ctx.user.id,
      userEmail: ctx.user.email || void 0,
      userName: ctx.user.name || void 0,
      action: "assessment_start",
      description: "Started a new assessment",
      details: `Assessment ID: ${assessmentId}`
    });
    return { id: assessmentId };
  }),
  /**
   * Save answers to a draft assessment
   */
  saveAnswers: protectedProcedure.input(
    z2.object({
      assessmentId: z2.string(),
      answers: z2.record(z2.string(), z2.number().min(1).max(5))
    })
  ).mutation(async ({ ctx, input }) => {
    const assessment = await getAssessmentById(input.assessmentId);
    if (!assessment || assessment.userId !== ctx.user.id) {
      throw new Error("Assessment not found or access denied");
    }
    const db = await (await Promise.resolve().then(() => (init_db(), db_exports))).getDb();
    if (db) {
      const { eq: eq4 } = await import("drizzle-orm");
      const { answers: answersTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      await db.delete(answersTable).where(eq4(answersTable.assessmentId, input.assessmentId));
    }
    const answersList = Object.entries(input.answers).map(([questionCode, score]) => ({
      assessmentId: input.assessmentId,
      questionCode,
      score
    }));
    if (answersList.length > 0) {
      await createAnswers(answersList);
    }
    await updateAssessment(input.assessmentId, {
      updatedAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  /**
   * Submit an assessment (calculate scores and mark as submitted)
   */
  submit: protectedProcedure.input(z2.object({ assessmentId: z2.string() })).mutation(async ({ ctx, input }) => {
    const assessment = await getAssessmentById(input.assessmentId);
    if (!assessment || assessment.userId !== ctx.user.id) {
      throw new Error("Assessment not found or access denied");
    }
    const answersList = await getAssessmentAnswers(input.assessmentId);
    if (answersList.length !== 36) {
      throw new Error(`Assessment incomplete: ${answersList.length}/36 questions answered`);
    }
    const answers2 = {};
    answersList.forEach((a) => {
      answers2[a.questionCode] = a.score;
    });
    const scoreResult = calculateScore(answers2);
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
      overallPct: scoreResult.overallPct.toString()
    };
    await createAssessmentScore(scoreData);
    await updateAssessment(input.assessmentId, {
      status: "submitted",
      submittedAt: /* @__PURE__ */ new Date()
    });
    await logActivity({
      userId: ctx.user.id,
      userEmail: ctx.user.email || void 0,
      userName: ctx.user.name || void 0,
      action: "assessment_submit",
      description: "Submitted assessment",
      details: `Overall Score: ${scoreResult.overallPct.toFixed(1)}%`
    });
    return { success: true, score: scoreResult };
  }),
  /**
   * Get the latest submitted assessment for the current user
   */
  getLatestSubmitted: protectedProcedure.query(async ({ ctx }) => {
    const assessments2 = await getUserAssessments(ctx.user.id);
    const submitted = assessments2.filter((a) => a.status === "submitted").sort((a, b) => {
      const aTime = a.submittedAt?.getTime() || 0;
      const bTime = b.submittedAt?.getTime() || 0;
      return bTime - aTime;
    });
    return submitted[0] || null;
  }),
  /**
   * Get assessment with scores and answers
   */
  getWithDetails: protectedProcedure.input(z2.object({ assessmentId: z2.string() })).query(async ({ ctx, input }) => {
    const assessment = await getAssessmentById(input.assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    if (assessment.userId !== ctx.user.id && ctx.user.role !== "admin") {
      throw new Error("Access denied");
    }
    const answers2 = await getAssessmentAnswers(input.assessmentId);
    const score = await getAssessmentScore(input.assessmentId);
    return {
      assessment,
      answers: answers2,
      score
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
  getAdminDetails: adminProcedure.input(z2.object({ assessmentId: z2.string() })).query(async ({ input }) => {
    const assessment = await getAssessmentById(input.assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    const answers2 = await getAssessmentAnswers(input.assessmentId);
    const score = await getAssessmentScore(input.assessmentId);
    return {
      assessment,
      answers: answers2,
      score
    };
  })
});

// server/routers/activity.ts
import { z as z3 } from "zod";
init_db();

// server/admin-db.ts
init_schema();
init_db();
import { eq as eq2 } from "drizzle-orm";
import { nanoid as nanoid2 } from "nanoid";

// server/auth-utils.ts
import crypto from "crypto";
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1e5, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, hash) {
  const [salt, storedHash] = hash.split(":");
  if (!salt || !storedHash) return false;
  const computedHash = crypto.pbkdf2Sync(password, salt, 1e5, 64, "sha512").toString("hex");
  return computedHash === storedHash;
}
function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

// server/admin-db.ts
async function getAdminByUsername(username) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.select().from(adminSessions).where(eq2(adminSessions.username, username)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function getAdminByToken(token) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.select().from(adminSessions).where(eq2(adminSessions.sessionToken, token)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function updateAdminPassword(adminId, newPassword) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const passwordHash = hashPassword(newPassword);
  await db.update(adminSessions).set({
    passwordHash,
    isFirstLogin: false,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq2(adminSessions.id, adminId));
}
async function updateAdminLastLogin(adminId) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(adminSessions).set({
    lastLoginAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq2(adminSessions.id, adminId));
}
async function generateNewAdminSessionToken(adminId) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const newToken = generateSessionToken();
  await db.update(adminSessions).set({
    sessionToken: newToken,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq2(adminSessions.id, adminId));
  return newToken;
}

// server/_core/admin-context.ts
function extractAdminToken(req) {
  const authHeader = req.headers?.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const adminToken = req.headers?.["x-admin-token"];
  if (adminToken) {
    return adminToken;
  }
  return null;
}
async function verifyAdminToken(token) {
  if (!token) return null;
  return await getAdminByToken(token);
}
async function isUserAdmin(ctx) {
  if (ctx.user?.role === "admin") {
    return true;
  }
  const adminToken = extractAdminToken(ctx.req);
  if (adminToken) {
    const admin = await verifyAdminToken(adminToken);
    return !!admin;
  }
  return false;
}

// server/routers/activity.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
var activityRouter = router({
  /**
   * Admin: Get all activity logs (most recent first)
   * Accessible via OAuth admin role or admin token
   */
  getAll: publicProcedure.input(
    z3.object({
      limit: z3.number().int().positive().max(5e3).default(1e3)
    })
  ).query(async ({ ctx, input }) => {
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint"
      });
    }
    return await getActivityLog(input.limit);
  }),
  /**
   * Admin: Get activity logs for a specific user
   * Accessible via OAuth admin role or admin token
   */
  getByUser: publicProcedure.input(
    z3.object({
      userId: z3.number().int().positive(),
      limit: z3.number().int().positive().max(5e3).default(500)
    })
  ).query(async ({ ctx, input }) => {
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint"
      });
    }
    return await getUserActivityLog(input.userId, input.limit);
  }),
  /**
   * Admin: Get summary stats for activity dashboard
   * Accessible via OAuth admin role or admin token
   */
  getSummary: publicProcedure.query(async ({ ctx }) => {
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError3({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint"
      });
    }
    const allLogs = await getActivityLog(1e4);
    const actionCounts = {};
    allLogs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    const uniqueUsers = new Set(allLogs.map((log) => log.userId)).size;
    const logins = allLogs.filter((log) => log.action === "login").slice(0, 50);
    const logouts = allLogs.filter((log) => log.action === "logout").slice(0, 50);
    return {
      totalActivities: allLogs.length,
      actionCounts,
      uniqueUsers,
      recentLogins: logins,
      recentLogouts: logouts
    };
  })
});

// server/routers/admin.ts
import { z as z4 } from "zod";
init_db();
init_schema();
init_db();
import { eq as eq3 } from "drizzle-orm";
import { TRPCError as TRPCError4 } from "@trpc/server";
var adminRouter = router({
  /**
   * Admin: Get all users with their latest assessment scores
   * Accessible via OAuth admin role or admin token
   */
  getUsersWithScores: publicProcedure.query(async ({ ctx }) => {
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint"
      });
    }
    const db = await getDb();
    if (!db) return [];
    const allUsers = await db.select().from(users);
    const assessments2 = await getSubmittedAssessments();
    const usersWithScores = await Promise.all(
      allUsers.map(async (user) => {
        const userAssessments = assessments2.filter((a) => a.userId === user.id).sort((a, b) => {
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
          assessmentCount: userAssessments.length
        };
      })
    );
    return usersWithScores;
  }),
  /**
   * Admin: Get detailed view of a specific user
   */
  getUserDetail: publicProcedure.input(z4.object({ userId: z4.number().int().positive() })).query(async ({ ctx, input }) => {
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint"
      });
    }
    const db = await getDb();
    if (!db) return null;
    const userResult = await db.select().from(users).where(eq3(users.id, input.userId)).limit(1);
    const user = userResult[0];
    if (!user) return null;
    const assessments2 = await getSubmittedAssessments();
    const userAssessments = assessments2.filter((a) => a.userId === input.userId);
    const assessmentsWithScores = await Promise.all(
      userAssessments.map(async (assessment) => {
        const score = await getAssessmentScore(assessment.id);
        return { assessment, score };
      })
    );
    return {
      user,
      assessments: assessmentsWithScores
    };
  }),
  /**
   * Admin: Get all users for the user list
   * Accessible via OAuth admin role or admin token
   */
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const isAdmin = await isUserAdmin(ctx);
    if (!isAdmin) {
      throw new TRPCError4({
        code: "FORBIDDEN",
        message: "Only admins can access this endpoint"
      });
    }
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(users);
  })
});

// server/routers/admin-auth.ts
import { TRPCError as TRPCError5 } from "@trpc/server";
import { z as z5 } from "zod";
var adminAuthRouter = router({
  /**
   * Admin login with username and password
   */
  login: publicProcedure.input(
    z5.object({
      username: z5.string().min(1),
      password: z5.string().min(1)
    })
  ).mutation(async ({ input }) => {
    const admin = await getAdminByUsername(input.username);
    if (!admin) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Invalid credentials"
      });
    }
    const isValidPassword = verifyPassword(input.password, admin.passwordHash);
    if (!isValidPassword) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Invalid credentials"
      });
    }
    await updateAdminLastLogin(admin.id);
    const sessionToken = await generateNewAdminSessionToken(admin.id);
    return {
      sessionToken,
      isFirstLogin: admin.isFirstLogin,
      username: admin.username
    };
  }),
  /**
   * Verify admin session token
   */
  verify: publicProcedure.input(z5.object({ token: z5.string() })).query(async ({ input }) => {
    const admin = await getAdminByToken(input.token);
    if (!admin) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Invalid session"
      });
    }
    return {
      id: admin.id,
      username: admin.username,
      isFirstLogin: admin.isFirstLogin
    };
  }),
  /**
   * Change admin password (requires valid session)
   */
  changePassword: publicProcedure.input(
    z5.object({
      token: z5.string(),
      currentPassword: z5.string().min(1),
      newPassword: z5.string().min(8, "Password must be at least 8 characters")
    })
  ).mutation(async ({ input }) => {
    const admin = await getAdminByToken(input.token);
    if (!admin) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Invalid session"
      });
    }
    const isValidPassword = verifyPassword(
      input.currentPassword,
      admin.passwordHash
    );
    if (!isValidPassword) {
      throw new TRPCError5({
        code: "UNAUTHORIZED",
        message: "Current password is incorrect"
      });
    }
    await updateAdminPassword(admin.id, input.newPassword);
    const newSessionToken = await generateNewAdminSessionToken(admin.id);
    return {
      success: true,
      sessionToken: newSessionToken,
      message: "Password changed successfully"
    };
  }),
  /**
   * Get admin info from session token
   */
  getMe: publicProcedure.input(z5.object({ token: z5.string() })).query(async ({ input }) => {
    const admin = await getAdminByToken(input.token);
    if (!admin) {
      return null;
    }
    return {
      id: admin.id,
      username: admin.username,
      isFirstLogin: admin.isFirstLogin,
      lastLoginAt: admin.lastLoginAt
    };
  })
});

// server/routers/recommendations.ts
import { z as z6 } from "zod";
init_db();

// shared/recommendations.ts
var recommendationsDatabase = {
  // ORGANISATION DIMENSION
  "Organisation-Goals": {
    Nascent: [
      {
        title: "Establish Clear Organisational Direction",
        description: "Your organisation lacks clear, documented goals and strategic direction. This is the foundation for all other capabilities.",
        actionItems: [
          "Conduct a strategic planning workshop with leadership to define 3-5 year vision",
          "Document core values and mission statement",
          "Create a simple one-page strategic plan visible to all staff",
          "Establish quarterly business review cycles"
        ],
        priority: "high",
        timeframe: "0-3 months"
      }
    ],
    Emerging: [
      {
        title: "Strengthen Goal Alignment Across Teams",
        description: "You have some goals in place, but they may not be consistently understood or aligned across the organisation.",
        actionItems: [
          "Cascade strategic goals to department and team levels",
          "Implement OKR (Objectives and Key Results) framework",
          "Create visual goal dashboards accessible to all teams",
          "Establish monthly all-hands meetings to review progress"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Established: [
      {
        title: "Enhance Goal Measurement and Accountability",
        description: "Your goals are clear and mostly aligned, but measurement and accountability mechanisms need strengthening.",
        actionItems: [
          "Implement balanced scorecard approach with leading and lagging indicators",
          "Link individual performance goals to organisational objectives",
          "Establish monthly goal tracking and review meetings",
          "Create feedback loops for goal adjustment based on market changes"
        ],
        priority: "medium",
        timeframe: "1-2 months"
      }
    ],
    Advanced: [
      {
        title: "Optimize Goal Agility and Responsiveness",
        description: "Your goals are well-defined and tracked, but could be more responsive to market changes and emerging opportunities.",
        actionItems: [
          "Implement quarterly goal review cycles with market analysis",
          "Create rapid response protocols for strategic pivots",
          "Develop scenario planning for different market conditions",
          "Establish innovation pipeline aligned with strategic goals"
        ],
        priority: "medium",
        timeframe: "2-3 months"
      }
    ],
    Leading: [
      {
        title: "Maintain Strategic Excellence and Innovation",
        description: "Your organisation has exemplary goal-setting practices. Focus on continuous innovation and stakeholder engagement.",
        actionItems: [
          "Regularly benchmark against industry leaders",
          "Engage customers and stakeholders in goal co-creation",
          "Invest in emerging technology and trend monitoring",
          "Share best practices with industry peers"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  },
  "Organisation-Structure": {
    Nascent: [
      {
        title: "Establish Clear Organisational Structure",
        description: "Your organisation lacks a clear structure, leading to confusion about roles, responsibilities, and decision-making authority.",
        actionItems: [
          "Create an organisational chart with clear reporting lines",
          "Define roles and responsibilities for each position",
          "Document decision-making authority at each level",
          "Communicate structure to all employees"
        ],
        priority: "high",
        timeframe: "0-2 months"
      }
    ],
    Emerging: [
      {
        title: "Clarify and Optimize Organisational Roles",
        description: "You have a basic structure, but role clarity and cross-functional collaboration need improvement.",
        actionItems: [
          "Conduct role clarity workshops with each team",
          "Create RACI matrices for key processes",
          "Establish cross-functional working groups",
          "Document and communicate updated org structure"
        ],
        priority: "high",
        timeframe: "1-2 months"
      }
    ],
    Established: [
      {
        title: "Enhance Structural Flexibility and Collaboration",
        description: "Your structure is clear but may be too rigid. Consider more flexible, matrix-based approaches.",
        actionItems: [
          "Implement matrix management for cross-functional projects",
          "Create flexible team structures for innovation initiatives",
          "Establish communities of practice across departments",
          "Review and update org structure annually"
        ],
        priority: "medium",
        timeframe: "2-3 months"
      }
    ],
    Advanced: [
      {
        title: "Evolve to Adaptive Organisational Design",
        description: "Your structure is effective. Consider more adaptive, network-based approaches for greater agility.",
        actionItems: [
          "Pilot agile or holacracy principles in select teams",
          "Implement dynamic team formation for projects",
          "Create fluid role definitions that evolve with needs",
          "Establish network-based collaboration platforms"
        ],
        priority: "medium",
        timeframe: "3-6 months"
      }
    ],
    Leading: [
      {
        title: "Pioneer Next-Generation Organisational Models",
        description: "Your structure is exemplary. Continue innovating with emerging organisational paradigms.",
        actionItems: [
          "Explore and pilot emerging org models (e.g., teal organisations)",
          "Create self-managing teams with clear purpose",
          "Implement real-time decision-making frameworks",
          "Share structural innovations with industry"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  },
  "Organisation-Management": {
    Nascent: [
      {
        title: "Establish Basic Management Practices",
        description: "Your organisation lacks consistent management practices, leading to inconsistent decision-making and performance.",
        actionItems: [
          "Establish regular 1-on-1 meetings between managers and direct reports",
          "Create a basic performance management process",
          "Develop a management code of conduct",
          "Provide basic management training to all leaders"
        ],
        priority: "high",
        timeframe: "0-3 months"
      }
    ],
    Emerging: [
      {
        title: "Professionalize Management Practices",
        description: "You have some management practices, but they need standardization and consistency across the organisation.",
        actionItems: [
          "Implement consistent performance review cycles",
          "Create management competency framework",
          "Establish leadership development program",
          "Implement 360-degree feedback for managers"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Established: [
      {
        title: "Enhance Management Effectiveness and Development",
        description: "Your management practices are solid. Focus on continuous improvement and manager development.",
        actionItems: [
          "Implement coaching and mentoring programs for managers",
          "Create peer learning groups for leadership development",
          "Establish management metrics and dashboards",
          "Conduct annual management effectiveness reviews"
        ],
        priority: "medium",
        timeframe: "2-3 months"
      }
    ],
    Advanced: [
      {
        title: "Develop Transformational Leadership",
        description: "Your management practices are effective. Evolve toward transformational and adaptive leadership.",
        actionItems: [
          "Implement executive coaching for senior leaders",
          "Create succession planning and talent pipeline",
          "Develop change management capabilities",
          "Establish strategic leadership forums"
        ],
        priority: "medium",
        timeframe: "3-6 months"
      }
    ],
    Leading: [
      {
        title: "Model Exemplary Leadership Excellence",
        description: "Your management practices are world-class. Continue setting industry standards.",
        actionItems: [
          "Develop thought leadership and external visibility",
          "Create innovation labs led by senior leaders",
          "Establish mentoring relationships with external peers",
          "Publish and share leadership insights"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  },
  // PROCESS DIMENSION
  "Process-Goals": {
    Nascent: [
      {
        title: "Define Key Business Processes",
        description: "Your organisation lacks defined processes, leading to inefficiency and inconsistency in how work gets done.",
        actionItems: [
          "Identify and map 5-10 critical business processes",
          "Document current process flows with swim lanes",
          "Identify process owners for each critical process",
          "Create simple process documentation"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Emerging: [
      {
        title: "Establish Process Standards and Metrics",
        description: "You have some processes defined, but they lack clear standards, metrics, and continuous improvement mechanisms.",
        actionItems: [
          "Define process performance metrics (KPIs) for each process",
          "Establish process standards and best practices",
          "Create process documentation repository",
          "Implement basic process monitoring"
        ],
        priority: "high",
        timeframe: "1-2 months"
      }
    ],
    Established: [
      {
        title: "Optimize Process Efficiency and Effectiveness",
        description: "Your processes are defined and monitored. Focus on optimization and continuous improvement.",
        actionItems: [
          "Conduct process efficiency reviews quarterly",
          "Implement lean or Six Sigma methodologies",
          "Establish process improvement teams",
          "Automate manual process steps where possible"
        ],
        priority: "medium",
        timeframe: "2-4 months"
      }
    ],
    Advanced: [
      {
        title: "Enable Process Agility and Innovation",
        description: "Your processes are efficient. Make them more adaptive and responsive to change.",
        actionItems: [
          "Implement agile process management approaches",
          "Create rapid process redesign capabilities",
          "Establish innovation sprints for process improvement",
          "Implement real-time process monitoring and alerts"
        ],
        priority: "medium",
        timeframe: "3-6 months"
      }
    ],
    Leading: [
      {
        title: "Pioneer Process Excellence and Transformation",
        description: "Your processes are exemplary. Continue driving industry-leading innovation.",
        actionItems: [
          "Explore AI and automation for process optimization",
          "Implement predictive process analytics",
          "Create process innovation labs",
          "Share process innovations with industry peers"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  },
  "Process-Structure": {
    Nascent: [
      {
        title: "Build Process Infrastructure",
        description: "Your organisation lacks the infrastructure to support consistent process execution.",
        actionItems: [
          "Implement basic process management tools or systems",
          "Create process documentation standards",
          "Establish process governance structure",
          "Train staff on process documentation and execution"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Emerging: [
      {
        title: "Strengthen Process Governance and Control",
        description: "You have basic infrastructure, but governance and control mechanisms need strengthening.",
        actionItems: [
          "Establish process governance committee",
          "Implement process audit and compliance mechanisms",
          "Create process change control procedures",
          "Implement process performance dashboards"
        ],
        priority: "high",
        timeframe: "1-2 months"
      }
    ],
    Established: [
      {
        title: "Enhance Process Integration and Automation",
        description: "Your process infrastructure is solid. Focus on integration and automation.",
        actionItems: [
          "Integrate processes across systems and departments",
          "Automate routine process steps",
          "Implement workflow management systems",
          "Create process exception handling procedures"
        ],
        priority: "medium",
        timeframe: "2-4 months"
      }
    ],
    Advanced: [
      {
        title: "Implement Intelligent Process Management",
        description: "Your infrastructure is advanced. Leverage AI and analytics for optimization.",
        actionItems: [
          "Implement process mining and analytics",
          "Use AI for process optimization recommendations",
          "Create self-healing process capabilities",
          "Implement predictive process analytics"
        ],
        priority: "medium",
        timeframe: "3-6 months"
      }
    ],
    Leading: [
      {
        title: "Lead Process Innovation and Excellence",
        description: "Your infrastructure is world-class. Continue setting new standards.",
        actionItems: [
          "Explore quantum computing applications for processes",
          "Implement autonomous process management",
          "Create process innovation partnerships",
          "Publish process management research"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  },
  "Process-Management": {
    Nascent: [
      {
        title: "Establish Process Ownership and Accountability",
        description: "Processes lack clear ownership and accountability, leading to confusion and inconsistent execution.",
        actionItems: [
          "Assign process owners for each critical process",
          "Define process owner responsibilities",
          "Create process management job descriptions",
          "Establish process review meetings"
        ],
        priority: "high",
        timeframe: "0-2 months"
      }
    ],
    Emerging: [
      {
        title: "Develop Process Management Capabilities",
        description: "You have process owners, but they lack the skills and tools to effectively manage processes.",
        actionItems: [
          "Provide process management training",
          "Implement process management tools",
          "Create process management standards",
          "Establish process improvement training program"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Established: [
      {
        title: "Advance Process Management Maturity",
        description: "Your process management is solid. Focus on continuous improvement and capability development.",
        actionItems: [
          "Implement process management certification program",
          "Create process management center of excellence",
          "Establish process benchmarking program",
          "Implement advanced process analytics"
        ],
        priority: "medium",
        timeframe: "2-4 months"
      }
    ],
    Advanced: [
      {
        title: "Enable Adaptive Process Management",
        description: "Your process management is effective. Make it more adaptive and responsive.",
        actionItems: [
          "Implement agile process management approaches",
          "Create rapid process adaptation capabilities",
          "Establish process innovation teams",
          "Implement real-time process optimization"
        ],
        priority: "medium",
        timeframe: "3-6 months"
      }
    ],
    Leading: [
      {
        title: "Champion Process Management Excellence",
        description: "Your process management is exemplary. Continue driving innovation and excellence.",
        actionItems: [
          "Develop thought leadership in process management",
          "Create process management partnerships",
          "Establish industry process management standards",
          "Share best practices and innovations"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  },
  // PEOPLE DIMENSION
  "People-Goals": {
    Nascent: [
      {
        title: "Define People and Talent Strategy",
        description: "Your organisation lacks a clear people strategy, leading to talent gaps and engagement issues.",
        actionItems: [
          "Conduct talent needs analysis",
          "Define talent strategy and goals",
          "Identify critical roles and competencies",
          "Create workforce planning framework"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Emerging: [
      {
        title: "Strengthen Talent Alignment and Development",
        description: "You have a basic people strategy, but alignment and development mechanisms need strengthening.",
        actionItems: [
          "Implement competency framework",
          "Create talent development plans",
          "Establish learning and development programs",
          "Implement succession planning"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Established: [
      {
        title: "Enhance Talent Engagement and Retention",
        description: "Your people strategy is clear. Focus on engagement, retention, and continuous development.",
        actionItems: [
          "Implement employee engagement surveys",
          "Create retention programs for high performers",
          "Establish mentoring and coaching programs",
          "Implement career development frameworks"
        ],
        priority: "medium",
        timeframe: "2-3 months"
      }
    ],
    Advanced: [
      {
        title: "Build High-Performance Culture",
        description: "Your people strategy is effective. Focus on creating a high-performance culture.",
        actionItems: [
          "Implement performance management excellence",
          "Create innovation and entrepreneurship programs",
          "Establish leadership development pipeline",
          "Implement employee wellness programs"
        ],
        priority: "medium",
        timeframe: "3-6 months"
      }
    ],
    Leading: [
      {
        title: "Model Exemplary People Leadership",
        description: "Your people strategy is world-class. Continue setting industry standards.",
        actionItems: [
          "Develop employer brand and reputation",
          "Create talent attraction and retention excellence",
          "Establish thought leadership in people management",
          "Share best practices with industry"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  },
  "People-Structure": {
    Nascent: [
      {
        title: "Establish Talent Management Infrastructure",
        description: "Your organisation lacks the infrastructure to support effective talent management.",
        actionItems: [
          "Implement HR systems and tools",
          "Create talent management processes",
          "Establish HR governance structure",
          "Develop HR policies and procedures"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Emerging: [
      {
        title: "Strengthen Talent Management Processes",
        description: "You have basic HR infrastructure, but talent management processes need strengthening.",
        actionItems: [
          "Implement recruitment and onboarding processes",
          "Create performance management system",
          "Establish learning management system",
          "Implement compensation and benefits management"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Established: [
      {
        title: "Optimize Talent Management Systems",
        description: "Your talent management infrastructure is solid. Focus on optimization and integration.",
        actionItems: [
          "Integrate HR systems and data",
          "Implement analytics for talent insights",
          "Create self-service HR capabilities",
          "Implement talent marketplace platforms"
        ],
        priority: "medium",
        timeframe: "2-4 months"
      }
    ],
    Advanced: [
      {
        title: "Enable Intelligent Talent Management",
        description: "Your talent infrastructure is advanced. Leverage AI and analytics for optimization.",
        actionItems: [
          "Implement AI-powered recruitment",
          "Use predictive analytics for talent planning",
          "Create personalized learning paths",
          "Implement skills-based organization"
        ],
        priority: "medium",
        timeframe: "3-6 months"
      }
    ],
    Leading: [
      {
        title: "Pioneer Next-Generation Talent Management",
        description: "Your talent infrastructure is world-class. Continue driving innovation.",
        actionItems: [
          "Explore emerging talent technologies",
          "Implement autonomous talent management",
          "Create talent innovation labs",
          "Lead industry talent management standards"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  },
  "People-Management": {
    Nascent: [
      {
        title: "Establish People Management Practices",
        description: "Your organisation lacks consistent people management practices, leading to inconsistent employee experiences.",
        actionItems: [
          "Establish regular team meetings and communication",
          "Create basic performance feedback processes",
          "Develop people management guidelines",
          "Provide basic people management training"
        ],
        priority: "high",
        timeframe: "0-3 months"
      }
    ],
    Emerging: [
      {
        title: "Professionalize People Management",
        description: "You have some people management practices, but they need standardization and consistency.",
        actionItems: [
          "Implement consistent feedback and recognition",
          "Create people management competency framework",
          "Establish employee engagement programs",
          "Implement conflict resolution processes"
        ],
        priority: "high",
        timeframe: "1-3 months"
      }
    ],
    Established: [
      {
        title: "Enhance People Development and Engagement",
        description: "Your people management practices are solid. Focus on development and engagement.",
        actionItems: [
          "Implement coaching and mentoring programs",
          "Create peer learning and collaboration",
          "Establish wellness and wellbeing programs",
          "Implement employee recognition programs"
        ],
        priority: "medium",
        timeframe: "2-3 months"
      }
    ],
    Advanced: [
      {
        title: "Build Exceptional People Leadership",
        description: "Your people management is effective. Focus on creating exceptional experiences.",
        actionItems: [
          "Implement personalized development plans",
          "Create innovation and autonomy programs",
          "Establish purpose-driven work initiatives",
          "Implement holistic wellbeing programs"
        ],
        priority: "medium",
        timeframe: "3-6 months"
      }
    ],
    Leading: [
      {
        title: "Model Exemplary People Leadership",
        description: "Your people management is world-class. Continue setting industry standards.",
        actionItems: [
          "Develop employer brand and reputation",
          "Create talent attraction excellence",
          "Establish thought leadership in people management",
          "Share best practices with industry peers"
        ],
        priority: "low",
        timeframe: "Ongoing"
      }
    ]
  }
};
function getRecommendations(category, dimension, maturityLevel, score) {
  const key = `${dimension}-${category}`;
  const recommendations = recommendationsDatabase[key]?.[maturityLevel] || [];
  let nextLevelGuidance;
  const levels = ["Nascent", "Emerging", "Established", "Advanced", "Leading"];
  const currentIndex = levels.indexOf(maturityLevel);
  if (currentIndex < levels.length - 1) {
    const nextLevel = levels[currentIndex + 1];
    const nextRecommendations = recommendationsDatabase[key]?.[nextLevel];
    if (nextRecommendations && nextRecommendations.length > 0) {
      nextLevelGuidance = `To reach ${nextLevel} level: ${nextRecommendations[0].title}`;
    }
  }
  return {
    category,
    dimension,
    maturityLevel,
    currentScore: score,
    recommendations,
    nextLevelGuidance
  };
}
function getAllRecommendations(scores) {
  const categories = [
    { dimension: "Organisation", category: "Goals", score: scores.organisationGoals },
    { dimension: "Organisation", category: "Structure", score: scores.organisationStructure },
    { dimension: "Organisation", category: "Management", score: scores.organisationManagement },
    { dimension: "Process", category: "Goals", score: scores.processGoals },
    { dimension: "Process", category: "Structure", score: scores.processStructure },
    { dimension: "Process", category: "Management", score: scores.processManagement },
    { dimension: "People", category: "Goals", score: scores.peopleGoals },
    { dimension: "People", category: "Structure", score: scores.peopleStructure },
    { dimension: "People", category: "Management", score: scores.peopleManagement }
  ];
  return categories.map(({ dimension, category, score }) => {
    let maturityLevel = "Nascent";
    if (score < 2) maturityLevel = "Nascent";
    else if (score < 3) maturityLevel = "Emerging";
    else if (score < 4) maturityLevel = "Established";
    else if (score < 4.5) maturityLevel = "Advanced";
    else maturityLevel = "Leading";
    return getRecommendations(category, dimension, maturityLevel, score);
  });
}

// server/routers/recommendations.ts
import { TRPCError as TRPCError6 } from "@trpc/server";
var recommendationsRouter = router({
  /**
   * Get recommendations for a specific assessment
   * Accessible to assessment owner or admins
   */
  getForAssessment: publicProcedure.input(z6.object({ assessmentId: z6.string() })).query(async ({ ctx, input }) => {
    const { getAssessmentById: getAssessmentById2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const assessment = await getAssessmentById2(input.assessmentId);
    if (!assessment) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Assessment not found"
      });
    }
    const isAdmin = await isUserAdmin(ctx);
    const isOwner = ctx.user && assessment.userId === ctx.user.id;
    if (!isOwner && !isAdmin) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Access denied"
      });
    }
    const score = await getAssessmentScore(input.assessmentId);
    if (!score) {
      throw new Error("Assessment score not found");
    }
    const scores = {
      organisationGoals: parseFloat(score.organisationGoals || "0"),
      organisationStructure: parseFloat(score.organisationStructure || "0"),
      organisationManagement: parseFloat(score.organisationManagement || "0"),
      processGoals: parseFloat(score.processGoals || "0"),
      processStructure: parseFloat(score.processStructure || "0"),
      processManagement: parseFloat(score.processManagement || "0"),
      peopleGoals: parseFloat(score.peopleGoals || "0"),
      peopleStructure: parseFloat(score.peopleStructure || "0"),
      peopleManagement: parseFloat(score.peopleManagement || "0")
    };
    const recommendations = getAllRecommendations(scores);
    return {
      assessmentId: input.assessmentId,
      recommendations,
      generatedAt: /* @__PURE__ */ new Date()
    };
  }),
  /**
   * Get recommendations for the latest submitted assessment
   */
  getForLatestAssessment: protectedProcedure.query(async ({ ctx }) => {
    const { getUserAssessments: getUserAssessments2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const assessments2 = await getUserAssessments2(ctx.user.id);
    const submitted = assessments2.filter((a) => a.status === "submitted").sort((a, b) => {
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
    const scores = {
      organisationGoals: parseFloat(score.organisationGoals || "0"),
      organisationStructure: parseFloat(score.organisationStructure || "0"),
      organisationManagement: parseFloat(score.organisationManagement || "0"),
      processGoals: parseFloat(score.processGoals || "0"),
      processStructure: parseFloat(score.processStructure || "0"),
      processManagement: parseFloat(score.processManagement || "0"),
      peopleGoals: parseFloat(score.peopleGoals || "0"),
      peopleStructure: parseFloat(score.peopleStructure || "0"),
      peopleManagement: parseFloat(score.peopleManagement || "0")
    };
    const recommendations = getAllRecommendations(scores);
    return {
      assessmentId: latestAssessment.id,
      recommendations,
      generatedAt: /* @__PURE__ */ new Date()
    };
  })
});

// server/routers.ts
init_db();
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      await logActivity({
        userId: ctx.user.id,
        userEmail: ctx.user.email || void 0,
        userName: ctx.user.name || void 0,
        action: "logout",
        description: "User logged out"
      });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Feature routers
  assessment: assessmentRouter,
  activity: activityRouter,
  admin: adminRouter,
  adminAuth: adminAuthRouter,
  recommendations: recommendationsRouter
});

// server/_core/context.ts
init_db();
var loginTracking = /* @__PURE__ */ new WeakMap();
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
    if (user) {
      if (!loginTracking.has(opts.req)) {
        loginTracking.set(opts.req, /* @__PURE__ */ new Set());
      }
      const requestLoggedIn = loginTracking.get(opts.req);
      if (!requestLoggedIn.has(user.id)) {
        requestLoggedIn.add(user.id);
        logActivity({
          userId: user.id,
          userEmail: user.email || void 0,
          userName: user.name || void 0,
          action: "login",
          description: "User logged in"
        }).catch((err) => console.error("[Activity Log] Failed to log login:", err));
      }
    }
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// api/_index.ts
import path from "path";
import fs from "fs";
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var publicDir = path.resolve(process.cwd(), "dist/public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}
var index_default = app;
export {
  index_default as default
};
