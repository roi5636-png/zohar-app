import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateZoharPages, TOTAL_ZOHAR_PAGES } from "@shared/zohar-structure";
import { z } from "zod";

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Create a new reading
  app.post("/api/readings", (req, res) => {
    try {
      const body = z.object({
        title: z.string().min(1),
        organizerName: z.string().min(1),
      }).parse(req.body);

      const slug = generateSlug();

      const reading = storage.createReading({
        slug,
        title: body.title,
        organizerName: body.organizerName,
        totalPages: TOTAL_ZOHAR_PAGES,
      });

      const zoharPages = generateZoharPages();

      const pageRecords = zoharPages.map(p => ({
        readingId: reading.id,
        pageNumber: p.pageNumber,
        sefariaRef: p.sefariaRef,
        displayName: p.displayName,
        parasha: p.parasha,
        readerName: null,
        isRead: 0,
      }));

      storage.createPages(pageRecords);

      res.json(reading);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // Get reading by slug
  app.get("/api/readings/:slug", (req, res) => {
    const { slug } = req.params;

    if (!slug || slug === "undefined") {
      return res.status(400).json({ error: "Invalid slug" });
    }

    const reading = storage.getReadingBySlug(slug);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const stats = storage.getReadingStats(reading.id);

    res.json({ ...reading, stats });
  });

  // Get next page
  app.get("/api/readings/:slug/next-page", (req, res) => {
    const { slug } = req.params;

    if (!slug || slug === "undefined") {
      return res.status(400).json({ error: "Invalid slug" });
    }

    const reading = storage.getReadingBySlug(slug);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const page = storage.getNextAvailablePage(reading.id);

    if (!page) {
      return res.json({ complete: true, message: "כל הזוהר הושלם!" });
    }

    res.json(page);
  });

  // Take page
  app.post("/api/pages/:pageId/take", (req, res) => {
    try {
      const { pageId } = req.params;

      if (!pageId || isNaN(Number(pageId))) {
        return res.status(400).json({ error: "Invalid pageId" });
      }

      const body = z.object({
        readerName: z.string().min(1),
      }).parse(req.body);

      const page = storage.markPageAsRead(Number(pageId), body.readerName);

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      res.json(page);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // Confirm page
  app.post("/api/pages/:pageId/confirm", (req, res) => {
    try {
      const { pageId } = req.params;

      if (!pageId || isNaN(Number(pageId))) {
        return res.status(400).json({ error: "Invalid pageId" });
      }

      const body = z.object({
        readerName: z.string().min(1),
      }).parse(req.body);

      const page = storage.markPageAsRead(Number(pageId), body.readerName);

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      res.json(page);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // Dashboard pages
  app.get("/api/readings/:slug/pages", async (req, res) => {
    const { slug } = req.params;

    if (!slug || slug === "undefined") {
      return res.status(400).json({ error: "Invalid slug" });
    }

    const reading = storage.getReadingBySlug(slug);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const allPages = storage.getPagesByReadingId(reading.id);
    const stats = storage.getReadingStats(reading.id);

    res.json({ reading, pages: allPages, stats });
  });

  // default reading
  const existing = storage.getReadingBySlug("default");

  if (!existing) {
    console.log("Creating default reading...");

    storage.createReading({
      slug: "default",
      title: "קריאה ראשונה",
      organizerName: "מערכת",
      totalPages: TOTAL_ZOHAR_PAGES,
    });

    console.log("Default reading created");
  }

  return httpServer;
}
