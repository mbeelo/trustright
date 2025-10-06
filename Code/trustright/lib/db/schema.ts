import { pgTable, text, timestamp, integer, jsonb, boolean, serial } from 'drizzle-orm/pg-core';

// Auth tables for NextAuth
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

export const accounts = pgTable('accounts', {
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verificationTokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// ClearChoice specific tables
export const websites = pgTable('websites', {
  id: serial('id').primaryKey(),
  domain: text('domain').notNull().unique(),

  // Store the complete analysis as JSON for flexibility
  analysisData: jsonb('analysis_data'),

  // Keep key fields for easy querying
  companyName: text('company_name'),
  trustScore: integer('trust_score'),

  // Legacy fields for compatibility
  name: text('name'),
  owner: text('owner'),
  ultimateControl: text('ultimate_control'),
  bias: text('bias'),
  stakeholders: jsonb('stakeholders'),
  revenue: jsonb('revenue'),
  flags: jsonb('flags'),

  lastUpdated: timestamp('last_updated', { mode: 'date' }).defaultNow(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const searches = pgTable('searches', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  websiteId: integer('websiteId').notNull().references(() => websites.id),
  url: text('url').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

export const userSubscriptions = pgTable('userSubscriptions', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripeCustomerId'),
  stripeSubscriptionId: text('stripeSubscriptionId'),
  stripePriceId: text('stripePriceId'),
  plan: text('plan').notNull().default('free'), // free, pro, enterprise
  searchesUsed: integer('searchesUsed').default(0),
  searchesLimit: integer('searchesLimit').default(5), // 5 free searches
  isActive: boolean('isActive').default(true),
  currentPeriodStart: timestamp('currentPeriodStart', { mode: 'date' }),
  currentPeriodEnd: timestamp('currentPeriodEnd', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});