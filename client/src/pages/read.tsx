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

  const { data: reading, isLoading: readingLoading } = useQuery<ReadingInfo>({
    queryKey: ["/api/readings", params.slug],
  });

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
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }, [params.slug]);

  const fetchZoharText = useCallback(async (sefariaRef: string) => {
    setTextLoading(true);
    try {
      const encodedRef = encodeURIComponent(sefariaRef);
      const res = await fetch(`https://www.sefaria.org/api/texts/${encodedRef}?context=0&pad=0`);
      const data = await res.json();

      if (data.he) {
        const texts: string[] = [];
        const flatten = (arr: any) => {
          if (typeof arr === "string") texts.push(arr);
          else if (Array.isArray(arr)) arr.forEach(flatten);
        };
        flatten(data.he);
        setZoharText(texts);
      } else {
        setZoharText(["הטקסט לא זמין"]);
      }
    } catch {
      setZoharText(["שגיאה בטעינת הטקסט"]);
    } finally {
      setTextLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentPage?.sefariaRef) {
      fetchZoharText(currentPage.sefariaRef);
    }
  }, [currentPage]);

  const confirmReading = useMutation({
    mutationFn: async () => {
      if (!currentPage) throw new Error();
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

  const handleStart = async () => {
    if (!readerName.trim()) return;
    setNameSubmitted(true);
    await fetchNextPage();
  };

  const progressPercent = reading
    ? Math.round((reading.stats.read / reading.stats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 py-6">

        {!nameSubmitted && (
          <Card>
            <CardContent className="pt-6">
              <Input
                value={readerName}
                onChange={(e) => setReaderName(e.target.value)}
                placeholder="השם שלך"
              />
              <Button onClick={handleStart} className="w-full mt-4">
                קבל דף
              </Button>
            </CardContent>
          </Card>
        )}

        {nameSubmitted && currentPage && (
          <div className="space-y-4">

            {/* פרטי הדף */}
            <Card>
              <CardContent className="py-4 flex justify-between">
                <Badge>{currentPage.parasha}</Badge>
                <span>{currentPage.displayName}</span>
              </CardContent>
            </Card>

            {/* 🔥 הטקסט עם עיצוב קלף */}
            <Card
              className="bg-[#f8f1d4] border border-yellow-600 rounded-xl shadow-lg"
              data-testid="card-zohar-text"
            >
              <CardContent className="py-6">

                {textLoading ? (
                  <div className="text-center">טוען...</div>
                ) : (
                  <div dir="rtl">
                    {zoharText.map((p, i) => (
                      <p key={i} className="mb-3 leading-loose">
                        {p}
                      </p>
                    ))}
                  </div>
                )}

              </CardContent>
            </Card>

            {!confirmed && (
              <Button onClick={() => confirmReading.mutate()} className="w-full">
                קראתי
              </Button>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
