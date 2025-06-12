import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  currentLevel: integer("current_level").notNull().default(1),
  completedLevels: jsonb("completed_levels").$type<number[]>().notNull().default([]),
  totalStars: integer("total_stars").notNull().default(0),
  badges: jsonb("badges").$type<string[]>().notNull().default([]),
  achievements: jsonb("achievements").$type<Achievement[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const levelProgress = pgTable("level_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  level: integer("level").notNull(),
  completed: boolean("completed").notNull().default(false),
  stars: integer("stars").notNull().default(0),
  completedAt: timestamp("completed_at"),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  studentName: text("student_name").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  certificateData: jsonb("certificate_data").$type<CertificateData>(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLevelProgressSchema = createInsertSchema(levelProgress).omit({
  id: true,
  completedAt: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export type LevelProgress = typeof levelProgress.$inferSelect;
export type InsertLevelProgress = z.infer<typeof insertLevelProgressSchema>;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  level: number;
}

export interface CertificateData {
  studentName: string;
  completionDate: string;
  levels: {
    level: number;
    title: string;
    completed: boolean;
    stars: number;
  }[];
  totalStars: number;
  badges: string[];
}

export interface GameState {
  currentLevel: number;
  completedLevels: number[];
  totalStars: number;
  badges: string[];
  achievements: Achievement[];
  audioEnabled: boolean;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: 'puzzle' | 'code' | 'design' | 'ui' | 'robot' | '3dgame';
  color: string;
  icon: string;
  skills: string[];
  isLocked: boolean;
  isCompleted: boolean;
  stars: number;
}
