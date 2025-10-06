-- Drop and recreate websites table for new comprehensive analysis structure
DROP TABLE IF EXISTS "websites" CASCADE;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "websites" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"analysisData" jsonb,
	"companyName" text,
	"trustScore" integer,
	"name" text,
	"owner" text,
	"ultimateControl" text,
	"bias" text,
	"stakeholders" jsonb,
	"revenue" jsonb,
	"flags" jsonb,
	"lastUpdated" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "websites_domain_unique" UNIQUE("domain")
);--> statement-breakpoint