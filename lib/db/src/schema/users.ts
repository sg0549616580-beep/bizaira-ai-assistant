import { pgTable, text, boolean, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profilesTable = pgTable("profiles", {
  user_id: uuid("user_id").primaryKey(),
  full_name: text("full_name"),
  email: text("email").notNull(),
  business_type: text("business_type"),
  target_audience: text("target_audience"),
  business_goals: text("business_goals"),
  plan: text("plan").default("free").notNull(),
  credits_total: integer("credits_total").default(100).notNull(),
  credits_used: integer("credits_used").default(0).notNull(),
  plan_started_at: timestamp("plan_started_at").defaultNow().notNull(),
  last_renewal_at: timestamp("last_renewal_at").defaultNow().notNull(),
  marketing_consent: boolean("marketing_consent").default(false).notNull(),
  onboarding_completed: boolean("onboarding_completed").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({
  created_at: true,
  updated_at: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;