import { type Reading, type InsertReading, type Page, type InsertPage, readings, pages } from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and, sql } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);

export interface IStorage {
  createReading(reading: InsertReading & { totalPages: number }): Reading;
  getReadingBySlug(slug: string): Reading | undefined;
  getReadingById(id: number): Reading | undefined;
  createPages(readingPages: InsertPage[]): void;
  getPagesByReadingId(readingId: number): Page[];
  getNextAvailablePage(readingId: number): Page | undefined;
  markPageAsRead(pageId: number, readerName: string): Page | undefined;
  getReadingStats(readingId: number): { total: number; read: number };
}

export class DatabaseStorage implements IStorage {
  createReading(reading: InsertReading & { totalPages: number }): Reading {
    return db.insert(readings).values({
      slug: reading.slug,
      title: reading.title,
      organizerName: reading.organizerName,
      totalPages: reading.totalPages,
    }).returning().get();
  }

  getReadingBySlug(slug: string): Reading | undefined {
    return db.select().from(readings).where(eq(readings.slug, slug)).get();
  }

  getReadingById(id: number): Reading | undefined {
    return db.select().from(readings).where(eq(readings.id, id)).get();
  }

  createPages(readingPages: InsertPage[]): void {
    // Insert in batches of 100
    for (let i = 0; i < readingPages.length; i += 100) {
      const batch = readingPages.slice(i, i + 100);
      db.insert(pages).values(batch).run();
    }
  }

  getPagesByReadingId(readingId: number): Page[] {
    return db.select().from(pages).where(eq(pages.readingId, readingId)).all();
  }

  getNextAvailablePage(readingId: number): Page | undefined {
    return db.select().from(pages)
      .where(and(eq(pages.readingId, readingId), eq(pages.isRead, 0), sql`${pages.readerName} IS NULL`))
      .limit(1)
      .get();
  }

  markPageAsRead(pageId: number, readerName: string): Page | undefined {
    db.update(pages)
      .set({ isRead: 1, readerName })
      .where(eq(pages.id, pageId))
      .run();
    return db.select().from(pages).where(eq(pages.id, pageId)).get();
  }

  getReadingStats(readingId: number): { total: number; read: number } {
    const allPages = db.select().from(pages).where(eq(pages.readingId, readingId)).all();
    const readPages = allPages.filter(p => p.isRead === 1);
    return { total: allPages.length, read: readPages.length };
  }
}

export const storage = new DatabaseStorage();
