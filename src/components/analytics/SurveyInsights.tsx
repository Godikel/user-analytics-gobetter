import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageSquare, ThumbsUp, TrendingUp } from "lucide-react";

const surveys = [
  {
    id: 1,
    name: "Course Satisfaction Q4",
    responses: 1234,
    avgRating: 4.5,
    sentiment: "positive",
    topFeedback: "Interactive content appreciated",
  },
  {
    id: 2,
    name: "Training Effectiveness",
    responses: 892,
    avgRating: 4.2,
    sentiment: "positive",
    topFeedback: "More practical examples needed",
  },
  {
    id: 3,
    name: "Platform Usability",
    responses: 567,
    avgRating: 3.8,
    sentiment: "neutral",
    topFeedback: "Mobile experience could improve",
  },
];

export function SurveyInsights() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "450ms" }}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-surveys" />
          Survey Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {surveys.map((survey) => (
          <div
            key={survey.id}
            className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">{survey.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {survey.responses.toLocaleString()} responses
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold">{survey.avgRating}</span>
                <span className="text-xs text-muted-foreground">/5</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs",
                  survey.sentiment === "positive" &&
                    "bg-live-classes/20 text-live-classes",
                  survey.sentiment === "neutral" &&
                    "bg-journeys/20 text-journeys"
                )}
              >
                {survey.sentiment === "positive" ? (
                  <ThumbsUp className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                {survey.sentiment}
              </div>
              <span className="text-xs text-muted-foreground truncate">
                "{survey.topFeedback}"
              </span>
            </div>
            <div className="flex gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={cn(
                    "flex-1 h-1 rounded-full",
                    star <= Math.round(survey.avgRating)
                      ? "bg-surveys"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
