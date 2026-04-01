import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Loader2, BarChart3 } from "lucide-react";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type { Page as ZoharPage } from "@shared/schema";

type ReadingInfo = {
  id: number;
  slug: string;
  title: string;
  organizerName: string;
  totalPages: number;
  stats: { total: number; read: number };
};

type PageResponse = ZoharPage | { complete: true; message: string };

function isComplete(resp: PageResponse): resp is { complete: true; message: string } {
  return "complete" in resp;
}

export default function ReadPage() {
  const params = useParams<{ slug: string }>();
  const qc = useQueryClient();
  const [readerName, setReaderName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState<ZoharPage | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [zoharText, setZoharText] = useState<string[]>([]);
  const [textLoading, setTextLoading] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // Get reading info
  const { data: reading, isLoading: readingLoading } = useQuery<ReadingInfo>({
    queryKey: ["/api/readings", params.slug],
  });

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (!params.slug) return;
    setPageLoading(true);
    try {
      const res = await apiRequest("GET", `/api/readings/${params.slug}/next-page`);
      const data = await res.json();
      if (isComplete(data)) {
        setAllComplete(true);
        setCurrentPage(null);
      } else {
        setCurrentPage(data as ZoharPage);
        setAllComplete(false);
      }
    } catch (err) {
      console.error("Failed to fetch page", err);
    } finally {
      setPageLoading(false);
    }
  }, [params.slug]);

  // Load Zohar text from Sefaria
  const fetchZoharText = useCallback(async (sefariaRef: string) => {
    setTextLoading(true);
    try {
      const encodedRef = encodeURIComponent(sefariaRef.replace(/, /g, ", "));
      const url = `https://www.sefaria.org/api/texts/${encodedRef}?context=0&pad=0`;
      const res = await fetch(url);
      const data = await res.json();
     
      if (data.he) {
        const texts: string[] = [];
        const flattenText = (arr: any) => {
          if (typeof arr === "string") {
            texts.push(arr);
          } else if (Array.isArray(arr)) {
            arr.forEach(flattenText);
          }
        };
        flattenText(data.he);
        setZoharText(texts);
      } else {
        setZoharText(["הטקסט לא זמין כרגע. אנא קראו מהספר שברשותכם."]);
      }
    } catch {
      setZoharText(["לא ניתן לטעון את הטקסט. אנא קראו מהספר שברשותכם."]);
    } finally {
      setTextLoading(false);
    }
  }, []);

  // When page is assigned, load its text
  useEffect(() => {
    if (currentPage && currentPage.sefariaRef) {
      fetchZoharText(currentPage.sefariaRef);
    }
  }, [currentPage, fetchZoharText]);

  // Confirm reading
  const confirmReading = useMutation({
    mutationFn: async () => {
      if (!currentPage) throw new Error("No page");
      const res = await apiRequest("POST", `/api/pages/${currentPage.id}/confirm`, {
        readerName,
      });
      return res.json();
    },
    onSuccess: () => {
      setConfirmed(true);
      qc.invalidateQueries({ queryKey: ["/api/readings", params.slug] });
    },
  });

  // Handle name submit — get a page
  const handleStart = async () => {
    if (!readerName.trim()) return;
    setNameSubmitted(true);
    await fetchNextPage();
  };

  // Handle getting another page
  const handleNextPage = async () => {
    setConfirmed(false);
    setZoharText([]);
    setCurrentPage(null);
    await fetchNextPage();
  };

  if (readingLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-sm">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive text-sm mb-4">הקריאה לא נמצאה</p>
            <Link href="/">
              <Button variant="outline" size="sm">חזרה לדף הבית</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercent = reading.stats.total > 0 ? Math.round((reading.stats.read / reading.stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Floating dashboard button */}
      <Link href={`/dashboard/${params.slug}`}>
        <button
          className="fixed top-4 left-4 z-50 flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors shadow-sm"
          data-testid="link-dashboard"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>דשבורד</span>
        </button>
      </Link>

      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none" aria-label="זוהר יחד">
              <circle cx="18" cy="18" r="16" stroke="hsl(38 70% 42%)" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="8" stroke="hsl(38 70% 42%)" strokeWidth="1" opacity="0.6" />
              <circle cx="18" cy="18" r="3" fill="hsl(38 70% 42%)" />
            </svg>
            <span className="font-bold text-sm text-foreground">זוהר יחד</span>
          </div>
          <h1 className="text-base font-semibold text-foreground" data-testid="text-reading-title">{reading.title}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>התקדמות</span>
            <span>{reading.stats.read} / {reading.stats.total} דפים ({progressPercent}%)</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Step 1: Enter name */}
        {!nameSubmitted && (
          <Card className="border border-border" data-testid="card-enter-name">
            <CardHeader>
              <CardTitle className="text-base text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                ברוכים הבאים לקריאת הזוהר
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reader-name" className="text-sm">מה השם שלך?</Label>
                  <Input
                    id="reader-name"
                    value={readerName}
                    onChange={(e) => setReaderName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStart()}
                    placeholder="הכנס/י את שמך"
                    className="text-right text-sm"
                    dir="rtl"
                    data-testid="input-reader-name"
                  />
                </div>
                <Button
                  onClick={handleStart}
                  className="w-full"
                  disabled={!readerName.trim() || pageLoading}
                  data-testid="button-start-reading"
                >
                  {pageLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                  קבל/י דף לקריאה
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All complete */}
        {nameSubmitted && allComplete && (
          <Card className="border border-primary/30 bg-primary/5" data-testid="card-all-complete">
            <CardContent className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-lg font-bold text-foreground mb-2">ספר הזוהר הושלם!</h2>
              <p className="text-muted-foreground text-sm">כל הדפים נקראו. תזכו למצוות!</p>
            </CardContent>
          </Card>
        )}

        {/* Loading page */}
        {nameSubmitted && pageLoading && !allComplete && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="mr-2 text-sm text-muted-foreground">מקבל דף...</span>
          </div>
        )}

        {/* Show the page */}
        {nameSubmitted && currentPage && !allComplete && !pageLoading && (
          <div className="space-y-4">
            {/* Page info */}
            <Card className="border border-border" data-testid="card-page-info">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{currentPage.parasha}</Badge>
                  <span className="text-sm font-medium">{currentPage.displayName}</span>
                </div>
              </CardContent>
            </Card>

            {/* Zohar text */}
          <Card 
  className="border border-[#d4af37] bg-gradient-to-b from-[#fff8e7] to-[#f3e2b3] shadow-2xl rounded-2xl"
  data-testid="card-zohar-text"
>
              <CardContent className="py-6">
                {textLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="mr-2 text-sm text-muted-foreground">טוען את הטקסט...</span>
                  </div>
                ) : (
                  <div className="zohar-text" dir="rtl">
                    {zoharText.map((paragraph, i) => (
                      <p
                        key={i}
                        className="mb-3 leading-loose"
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Confirm button */}
            {!confirmed ? (
              <Button
                onClick={() => confirmReading.mutate()}
                className="w-full py-6 text-base"
                disabled={confirmReading.isPending}
                data-testid="button-confirm-read"
              >
                {confirmReading.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                )}
                קראתי את הדף
              </Button>
            ) : (
              <Card className="border border-primary/30 bg-primary/5" data-testid="card-confirmed">
                <CardContent className="py-6 text-center">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-primary" />
                  <p className="text-sm font-semibold text-foreground mb-1">תודה רבה, {readerName}!</p>
                  <p className="text-xs text-muted-foreground mb-4">הדף סומן כנקרא</p>
                  <Button variant="outline" onClick={handleNextPage} data-testid="button-next-page">
                    קרא/י דף נוסף
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 py-6 text-center mt-8">
        <PerplexityAttribution />
      </footer>
    </div>
  );
}
