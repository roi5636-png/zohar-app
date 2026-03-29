import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// A reading session created by an organizer
export const readings = sqliteTable("readings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(), // unique URL slug
  title: text("title").notNull(), // e.g. "לעילוי נשמת..."
  organizerName: text("organizer_name").notNull(),
  totalPages: integer("total_pages").notNull().default(0), // computed on creation
});

// Individual page assignments
export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  readingId: integer("reading_id").notNull(),
  pageNumber: integer("page_number").notNull(), // sequential index
  sefariaRef: text("sefaria_ref").notNull(), // e.g. "Zohar, Bereshit.1"
  displayName: text("display_name").notNull(), // e.g. "בראשית דף טו ע\"א"
  parasha: text("parasha").notNull(),
  readerName: text("reader_name"), // who took this page
  isRead: integer("is_read").notNull().default(0), // 0=false, 1=true
});

export const insertReadingSchema = createInsertSchema(readings).omit({ id: true, totalPages: true });
export const insertPageSchema = createInsertSchema(pages).omit({ id: true });

export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Reading = typeof readings.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
