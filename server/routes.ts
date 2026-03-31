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

  // ✅ CREATE READING
  app.post("/api/readings", async (req, res) => {
    try {
      const body = z.object({
        title: z.string().min(1),
        organizerName: z.string().min(1),
      }).parse(req.body);

      const slug = generateSlug();

      // ✅ FIX 1 — await
      const reading = await storage.createReading({
        slug,
        title: body.title,
        organizerName: body.organizerName,
        totalPages: TOTAL_ZOHAR_PAGES,
      });

      const zoharPages = generateZoharPages();

      const pageRecords = zoharPages.map(p => ({
        readingId: reading.id, // ✅ FIX 2
        pageNumber: p.pageNumber,
        sefariaRef: p.sefariaRef,
        displayName: p.displayName,
        parasha: p.parasha,
        readerName: null,
        isRead: 0,
      }));

      // ✅ FIX 3 — await
      await storage.createPages(pageRecords);

      res.json(reading);

    } catch (error: any) {
      console.error("CREATE ERROR:", error); // חשוב ללוגים
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // ✅ GET READING
  app.get("/api/readings/:slug", async (req, res) => {
    const { slug } = req.params;

    if (!slug || slug === "undefined") {
      return res.status(400).json({ error: "Invalid slug" });
    }

    const reading = await storage.getReadingBySlug(slug);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const stats = await storage.getReadingStats(reading.id);

    res.json({ ...reading, stats });
  });

  // ✅ NEXT PAGE
  app.get("/api/readings/:slug/next-page", async (req, res) => {
    const { slug } = req.params;

    if (!slug || slug === "undefined") {
      return res.status(400).json({ error: "Invalid slug" });
    }

    const reading = await storage.getReadingBySlug(slug);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const page = await storage.getNextAvailablePage(reading.id);

    if (!page) {
      return res.json({ complete: true, message: "כל הזוהר הושלם!" });
    }

    res.json(page);
  });

  // ✅ TAKE PAGE
  app.post("/api/pages/:pageId/take", async (req, res) => {
    try {
      const { pageId } = req.params;

      if (!pageId || isNaN(Number(pageId))) {
        return res.status(400).json({ error: "Invalid pageId" });
      }

      const body = z.object({
        readerName: z.string().min(1),
      }).parse(req.body);

      const page = await storage.markPageAsRead(Number(pageId), body.readerName);

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      res.json(page);

    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // ✅ CONFIRM PAGE
  app.post("/api/pages/:pageId/confirm", async (req, res) => {
    try {
      const { pageId } = req.params;

      if (!pageId || isNaN(Number(pageId))) {
        return res.status(400).json({ error: "Invalid pageId" });
      }

      const body = z.object({
        readerName: z.string().min(1),
      }).parse(req.body);

      const page = await storage.markPageAsRead(Number(pageId), body.readerName);

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      res.json(page);

    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid request" });
    }
  });

  // ✅ DASHBOARD
  app.get("/api/readings/:slug/pages", async (req, res) => {
    const { slug } = req.params;

    if (!slug || slug === "undefined") {
      return res.status(400).json({ error: "Invalid slug" });
    }

    const reading = await storage.getReadingBySlug(slug);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found" });
    }

    const allPages = await storage.getPagesByReadingId(reading.id);
    const stats = await storage.getReadingStats(reading.id);

    res.json({ reading, pages: allPages, stats });
  });

  return httpServer;
}
