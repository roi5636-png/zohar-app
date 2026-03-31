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
      const res = await apiRequest("POST", "/api/readings", {
        title,
        organizerName,
      });
      return res.json();
    },

    onSuccess: (data) => {
      console.log("CREATED:", data);

      // הגנה קריטית
      if (!data || !data.slug) {
        alert("שגיאה ביצירת הקריאה");
        return;
      }

      // ניווט נכון
      navigate(`/read/${data.slug}`);
    },

    onError: () => {
      alert("אירעה שגיאה, נסה שוב");
    },
  });

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-xl font-bold">זוהר יחד</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            קריאת ספר הזוהר הקדוש בשיתוף הרבים
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-12">

        <div className="text-center mb-12">
          <h2 className="text-lg font-semibold mb-3">
            השלימו את קריאת הזוהר כולו — יחד
          </h2>
          <p className="text-muted-foreground text-sm">
            הזוהר מחולק ל־{TOTAL_ZOHAR_PAGES.toLocaleString()} דפים
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">

          <Card>
            <CardContent className="pt-6 text-center">
              <Share2 className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold text-sm">שלחו קישור</h3>
              <p className="text-muted-foreground text-xs">
                שתפו בוואטסאפ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold text-sm">קראו דף</h3>
              <p className="text-muted-foreground text-xs">
                כל אחד דף אחר
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold text-sm">עקבו</h3>
              <p className="text-muted-foreground text-xs">
                התקדמות הקריאה
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              פתיחת קריאת זוהר
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!title.trim() || !organizerName.trim()) {
                  alert("נא למלא את כל השדות");
                  return;
                }

                createReading.mutate();
              }}
              className="space-y-4"
            >

              <div>
                <Label>כותרת</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>שם המארגן</Label>
                <Input
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createReading.isPending}
              >
                {createReading.isPending
                  ? "יוצר..."
                  : "צור קריאה"}
              </Button>

            </form>
          </CardContent>
        </Card>

      </main>

      <footer className="text-center py-6">
        <PerplexityAttribution />
      </footer>

    </div>
  );
}
