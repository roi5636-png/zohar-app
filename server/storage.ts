import { type Reading, type InsertReading, type Page, type InsertPage, readings, pages } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;

export const client = postgres(connectionString);
export const db = drizzle(client);

export interface IStorage {
  createReading(reading: InsertReading & { totalPages: number }): Promise<Reading>;
  getReadingBySlug(slug: string): Promise<Reading | undefined>;
  getReadingById(id: number): Promise<Reading | undefined>;
  createPages(readingPages: InsertPage[]): Promise<void>;
  getPagesByReadingId(readingId: number): Promise<Page[]>;
  getNextAvailablePage(readingId: number): Promise<Page | undefined>;
  markPageAsRead(pageId: number, readerName: string): Promise<Page | undefined>;
  getReadingStats(readingId: number): Promise<{ total: number; read: number }>;
}

export class DatabaseStorage implements IStorage {

  async createReading(reading: InsertReading & { totalPages: number }): Promise<Reading> {
    const res = await db.insert(readings).values({
      slug: reading.slug,
      title: reading.title,
      organizerName: reading.organizerName,
      totalPages: reading.totalPages,
    }).returning();

    return res[0];
  }

  async getReadingBySlug(slug: string): Promise<Reading | undefined> {
    const res = await db.select().from(readings).where(eq(readings.slug, slug));
    return res[0];
  }

  async getReadingById(id: number): Promise<Reading | undefined> {
    const res = await db.select().from(readings).where(eq(readings.id, id));
    return res[0];
  }

  async createPages(readingPages: InsertPage[]): Promise<void> {
    for (let i = 0; i < readingPages.length; i += 100) {
      const batch = readingPages.slice(i, i + 100);
      await db.insert(pages).values(batch);
    }
  }

  async getPagesByReadingId(readingId: number): Promise<Page[]> {
    return await db.select().from(pages).where(eq(pages.readingId, readingId));
  }

  async getNextAvailablePage(readingId: number): Promise<Page | undefined> {
    const res = await db.select().from(pages)
      .where(and(eq(pages.readingId, readingId), eq(pages.isRead, 0), sql`${pages.readerName} IS NULL`))
      .limit(1);

    return res[0];
  }

  async markPageAsRead(pageId: number, readerName: string): Promise<Page | undefined> {
    const res = await db.update(pages)
      .set({ isRead: 1, readerName })
      .where(eq(pages.id, pageId))
      .returning();

    return res[0];
  }

  async getReadingStats(readingId: number): Promise<{ total: number; read: number }> {
    const allPages = await db.select().from(pages).where(eq(pages.readingId, readingId));
    const readPages = allPages.filter(p => p.isRead === 1);

    return {
      total: allPages.length,
      read: readPages.length
    };
  }
}

export const storage = new DatabaseStorage();
