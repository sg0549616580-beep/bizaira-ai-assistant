import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const generatedContentTable = pgTable("generated_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  project_id: uuid("project_id"),
  type: text("type").notNull(), // 'image' | 'text'
  prompt: text("prompt").notNull(),
  content: text("content"), // For text content
  image_url: text("image_url"), // For image content
  metadata: jsonb("metadata"), // Additional data like model used, etc.
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertGeneratedContentSchema = createInsertSchema(generatedContentTable).omit({
  id: true,
  created_at: true,
});

export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;
export type GeneratedContent = typeof generatedContentTable.$inferSelect;