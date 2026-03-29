import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen, Users, Share2 } from "lucide-react";
import { TOTAL_ZOHAR_PAGES } from "@shared/zohar-structure";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

export default function Home() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [organizerName, setOrganizerName] = useState("");

  const createReading = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/readings", { title, organizerName });
      return res.json();
    },
    onSuccess: (data) => {
      navigate(`/dashboard/${data.slug}`);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="זוהר יחד לוגו">
              <circle cx="18" cy="18" r="16" stroke="hsl(38 70% 42%)" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="8" stroke="hsl(38 70% 42%)" strokeWidth="1" opacity="0.6" />
              <circle cx="18" cy="18" r="3" fill="hsl(38 70% 42%)" />
              <path d="M18 2 L18 8 M18 28 L18 34 M2 18 L8 18 M28 18 L34 18" stroke="hsl(38 70% 42%)" strokeWidth="1" opacity="0.4" />
            </svg>
            <h1 className="text-xl font-bold text-foreground" data-testid="text-site-title">זוהר יחד</h1>
          </div>
          <p className="text-muted-foreground text-sm">קריאת ספר הזוהר הקדוש בשיתוף הרבים</p>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            השלימו את קריאת הזוהר כולו — יחד
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
            פתחו קריאה חדשה, שתפו את הקישור בוואטסאפ, וכל משתתף יקבל דף לקריאה.
            {" "}הזוהר מחולק ל-{TOTAL_ZOHAR_PAGES.toLocaleString()} דפים לפי פרשות.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="border border-border/50 bg-card/80">
            <CardContent className="pt-6 text-center">
              <Share2 className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-sm mb-1">שלחו קישור</h3>
              <p className="text-muted-foreground text-xs">שתפו בוואטסאפ או בכל מקום</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50 bg-card/80">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-sm mb-1">קראו דף</h3>
              <p className="text-muted-foreground text-xs">כל משתתף מקבל דף אחר</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50 bg-card/80">
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-sm mb-1">עקבו אחרי ההתקדמות</h3>
              <p className="text-muted-foreground text-xs">דשבורד מעקב למארגן</p>
            </CardContent>
          </Card>
        </div>

        {/* Create form */}
        <Card className="max-w-md mx-auto border border-border bg-card" data-testid="card-create-reading">
          <CardHeader>
            <CardTitle className="text-base text-center">פתיחת קריאת זוהר חדשה</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (title.trim() && organizerName.trim()) {
                  createReading.mutate();
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm">כותרת הקריאה</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='לדוגמה: "לעילוי נשמת..." או "לרפואת..."'
                  className="text-right text-sm"
                  dir="rtl"
                  data-testid="input-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer" className="text-sm">שם המארגן</Label>
                <Input
                  id="organizer"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="השם שלך"
                  className="text-right text-sm"
                  dir="rtl"
                  data-testid="input-organizer"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createReading.isPending || !title.trim() || !organizerName.trim()}
                data-testid="button-create"
              >
                {createReading.isPending ? "יוצר קריאה..." : "צור קריאת זוהר"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border/50 py-6 text-center">
        <PerplexityAttribution />
      </footer>
    </div>
  );
}
