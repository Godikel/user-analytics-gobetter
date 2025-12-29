import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Play } from "lucide-react";

const journeys = [
  {
    id: 1,
    name: "Onboarding Excellence",
    items: [
      { type: "course", name: "Company Culture 101", status: "completed" },
      { type: "assessment", name: "Culture Quiz", status: "completed" },
      { type: "course", name: "Tools & Systems", status: "current" },
      { type: "survey", name: "Onboarding Feedback", status: "pending" },
    ],
    progress: 50,
    participants: 234,
  },
  {
    id: 2,
    name: "Sales Mastery Path",
    items: [
      { type: "course", name: "Sales Fundamentals", status: "completed" },
      { type: "live-class", name: "Live: Pitch Perfect", status: "completed" },
      { type: "assessment", name: "Skills Assessment", status: "completed" },
      { type: "course", name: "Advanced Negotiation", status: "current" },
      { type: "survey", name: "Training Effectiveness", status: "pending" },
    ],
    progress: 60,
    participants: 156,
  },
  {
    id: 3,
    name: "Tech Upskilling Journey",
    items: [
      { type: "course", name: "Cloud Basics", status: "completed" },
      { type: "course", name: "DevOps Intro", status: "current" },
      { type: "assessment", name: "Technical Test", status: "pending" },
    ],
    progress: 33,
    participants: 89,
  },
];

const typeColors: Record<string, string> = {
  course: "bg-courses",
  assessment: "bg-assessments",
  survey: "bg-surveys",
  "live-class": "bg-live-classes",
};

export function LearningJourneyProgress() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "400ms" }}>
      <CardHeader>
        <CardTitle className="text-lg">Learning Journeys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {journeys.map((journey) => (
          <div key={journey.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{journey.name}</h4>
              <span className="text-xs text-muted-foreground">
                {journey.participants} participants
              </span>
            </div>
            <div className="flex items-center gap-2">
              {journey.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                      item.status === "completed" &&
                        "border-live-classes bg-live-classes/20",
                      item.status === "current" &&
                        "border-primary bg-primary/20 animate-pulse-glow",
                      item.status === "pending" &&
                        "border-muted bg-muted/20"
                    )}
                    title={`${item.name} (${item.type})`}
                  >
                    {item.status === "completed" && (
                      <CheckCircle2 className="w-4 h-4 text-live-classes" />
                    )}
                    {item.status === "current" && (
                      <Play className="w-3 h-3 text-primary fill-primary" />
                    )}
                    {item.status === "pending" && (
                      <Circle className="w-3 h-3 text-muted-foreground" />
                    )}
                    <div
                      className={cn(
                        "absolute -bottom-1 w-2 h-2 rounded-full",
                        typeColors[item.type]
                      )}
                    />
                  </div>
                  {index < journey.items.length - 1 && (
                    <div
                      className={cn(
                        "w-6 h-0.5",
                        item.status === "completed"
                          ? "bg-live-classes"
                          : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-courses rounded-full transition-all duration-500"
                  style={{ width: `${journey.progress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {journey.progress}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
