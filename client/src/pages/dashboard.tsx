import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Copy, Check, Share2, ArrowRight, User } from "lucide-react";
import { useState, useMemo, Fragment } from "react";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type { Page as ZoharPage } from "@shared/schema";

interface DashboardData {
  reading: {
    id: number;
    slug: string;
    title: string;
    organizerName: string;
    totalPages: number;
  };
  pages: ZoharPage[];
  stats: { total: number; read: number };
}

export default function Dashboard() {
  const params = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/readings", params.slug, "pages"],
    refetchInterval: 10000, // auto-refresh every 10 seconds
  });

  const participantLink = `${window.location.origin}${window.location.pathname}#/read/${params.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(participantLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for iframe sandbox
      const textArea = document.createElement("textarea");
      textArea.value = participantLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `📖 ${data?.reading.title}\n\nהוזמנת להשתתף בקריאת ספר הזוהר הקדוש!\nלחץ/י על הקישור, קרא/י את הדף שתקבל/י ואשר/י שקראת:\n\n${participantLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  // Group pages by parasha
  const parashaGroups = useMemo(() => {
    if (!data?.pages) return [];
    const groups: { parasha: string; total: number; read: number }[] = [];
    const map = new Map<string, { total: number; read: number }>();
    
    for (const page of data.pages) {
      const existing = map.get(page.parasha) || { total: 0, read: 0 };
      existing.total++;
      if (page.isRead) existing.read++;
      map.set(page.parasha, existing);
    }
    
    map.forEach((val, key) => groups.push({ parasha: key, ...val }));
    return groups;
  }, [data?.pages]);

  // Group pages by reader name with page details
  const readerStats = useMemo(() => {
    if (!data?.pages) return [];
    const map = new Map<string, { count: number; pageNames: string[] }>();
    for (const page of data.pages) {
      if (page.isRead && page.readerName) {
        const existing = map.get(page.readerName) || { count: 0, pageNames: [] };
        existing.count++;
        existing.pageNames.push(page.displayName);
        map.set(page.readerName, existing);
      }
    }
    const result = Array.from(map.entries()).map(([name, data]) => ({ name, ...data }));
    result.sort((a, b) => b.count - a.count);
    return result;
  }, [data?.pages]);

  const [expandedReader, setExpandedReader] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">טוען...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-sm">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">הקריאה לא נמצאה</p>
            <Link href="/">
              <Button variant="outline">חזרה לדף הבית</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { reading, stats } = data;
  const progressPercent = stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-label="זוהר יחד">
                <circle cx="18" cy="18" r="16" stroke="hsl(38 70% 42%)" strokeWidth="1.5" />
                <circle cx="18" cy="18" r="8" stroke="hsl(38 70% 42%)" strokeWidth="1" opacity="0.6" />
                <circle cx="18" cy="18" r="3" fill="hsl(38 70% 42%)" />
              </svg>
              <span className="font-bold text-sm text-foreground">זוהר יחד</span>
            </div>
          </Link>
          <Badge variant="secondary" className="text-xs">דשבורד מארגן</Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-bold text-foreground mb-1" data-testid="text-reading-title">{reading.title}</h1>
          <p className="text-muted-foreground text-xs">מארגן: {reading.organizerName}</p>
        </div>

        {/* Share section */}
        <Card className="mb-6 border border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 text-center sm:text-right">
                <p className="text-sm font-medium mb-1">שתפו את הקישור</p>
                <p className="text-xs text-muted-foreground truncate max-w-[300px]" dir="ltr">{participantLink}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy} data-testid="button-copy-link">
                  {copied ? <Check className="w-4 h-4 ml-1" /> : <Copy className="w-4 h-4 ml-1" />}
                  {copied ? "הועתק" : "העתק"}
                </Button>
                <Button size="sm" onClick={handleWhatsAppShare} className="bg-[#25D366] hover:bg-[#20BD5A] text-white" data-testid="button-share-whatsapp">
                  <Share2 className="w-4 h-4 ml-1" />
                  וואטסאפ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="border border-border/50">
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-primary" data-testid="text-pages-read">{stats.read}</p>
              <p className="text-xs text-muted-foreground">דפים נקראו</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total - stats.read}</p>
              <p className="text-xs text-muted-foreground">דפים נותרו</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">סה"כ דפים</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50">
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-primary" data-testid="text-progress">{progressPercent}%</p>
              <p className="text-xs text-muted-foreground">הושלם</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress bar */}
        <Card className="mb-8 border border-border/50">
          <CardContent className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">התקדמות כללית</span>
              <span className="text-sm text-muted-foreground">{stats.read} / {stats.total}</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            {progressPercent === 100 && (
              <p className="text-center mt-3 text-sm font-semibold text-primary">
                🎉 ספר הזוהר הושלם! מזל טוב!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Readers breakdown */}
        {readerStats.length > 0 && (
          <Card className="mb-6 border border-border/50">
            <CardHeader>
              <CardTitle className="text-base">משתתפים ({readerStats.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-[350px] overflow-y-auto">
                {readerStats.map((r) => (
                  <Fragment key={r.name}>
                    <button
                      onClick={() => setExpandedReader(expandedReader === r.name ? null : r.name)}
                      className="w-full flex items-center justify-between py-2 px-1 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm">{r.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">{r.count} {r.count === 1 ? 'דף' : 'דפים'}</Badge>
                    </button>
                    {expandedReader === r.name && (
                      <div className="pr-6 pb-2 text-xs text-muted-foreground space-y-0.5">
                        {r.pageNames.map((p, i) => (
                          <div key={i}>{p}</div>
                        ))}
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parasha breakdown */}
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-base">התקדמות לפי פרשה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {parashaGroups.map((g) => (
                <div key={g.parasha} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-24 shrink-0">{g.parasha}</span>
                  <div className="flex-1">
                    <Progress value={(g.read / g.total) * 100} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-left shrink-0">{g.read}/{g.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border/50 py-6 text-center">
        <PerplexityAttribution />
      </footer>
    </div>
  );
}
