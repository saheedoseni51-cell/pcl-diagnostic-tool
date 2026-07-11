CREATE TABLE "activityLog" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"userEmail" varchar(320),
	"userName" text,
	"action" varchar(64) NOT NULL,
	"description" text,
	"details" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adminSessions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"username" varchar(128) NOT NULL,
	"passwordHash" text NOT NULL,
	"sessionToken" varchar(256),
	"isFirstLogin" boolean DEFAULT true NOT NULL,
	"lastLoginAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "adminSessions_username_unique" UNIQUE("username"),
	CONSTRAINT "adminSessions_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessmentId" varchar(64) NOT NULL,
	"questionCode" varchar(10) NOT NULL,
	"score" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessmentScores" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessmentId" varchar(64) NOT NULL,
	"organisationGoals" numeric(5, 2),
	"organisationStructure" numeric(5, 2),
	"organisationManagement" numeric(5, 2),
	"processGoals" numeric(5, 2),
	"processStructure" numeric(5, 2),
	"processManagement" numeric(5, 2),
	"peopleGoals" numeric(5, 2),
	"peopleStructure" numeric(5, 2),
	"peopleManagement" numeric(5, 2),
	"organisationAvg" numeric(5, 2),
	"processAvg" numeric(5, 2),
	"peopleAvg" numeric(5, 2),
	"goalsAvg" numeric(5, 2),
	"structureAvg" numeric(5, 2),
	"managementAvg" numeric(5, 2),
	"overallAvg" numeric(5, 2),
	"organisationPct" numeric(6, 2),
	"processPct" numeric(6, 2),
	"peoplePct" numeric(6, 2),
	"goalsPct" numeric(6, 2),
	"structurePct" numeric(6, 2),
	"managementPct" numeric(6, 2),
	"overallPct" numeric(6, 2),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"participantName" text,
	"email" varchar(320),
	"organisation" text,
	"unit" text,
	"region" text,
	"roleType" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"submittedAt" timestamp,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"organisation" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
