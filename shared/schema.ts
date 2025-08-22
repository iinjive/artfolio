import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Projects table for portfolio management with multimedia support
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  software: text("software").notNull(),
  thumbnail: text("thumbnail").notNull(), // Main preview image
  description: text("description").notNull(),
  category: text("category").notNull(),
  size: text("size").notNull(),
  // JSON field for multimedia content blocks
  content: text("content").notNull().default("[]"), // Array of {type: 'image'|'video'|'text', content: string, order: number}
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ createdAt: true, updatedAt: true });
export const updateProjectSchema = insertProjectSchema.partial().omit({ id: true });

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Content block schema for multimedia projects
export const contentBlockSchema = z.object({
  type: z.enum(["image", "video", "text"]),
  content: z.string(),
  order: z.number(),
});

// Validation schemas
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  software: z.string().min(1, "Software is required"),
  thumbnail: z.string().url("Must be a valid URL"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["environment", "technical"]),
  size: z.enum(["medium", "large", "wide"]),
  content: z.array(contentBlockSchema).default([])
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
