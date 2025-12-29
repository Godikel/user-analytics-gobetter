import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Video } from "lucide-react";

const liveClasses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "Sarah Chen",
    date: "Today",
    time: "2:00 PM",
    attendees: 145,
    maxCapacity: 200,
    status: "live",
  },
  {
    id: 2,
    title: "Design Systems Workshop",
    instructor: "Mike Johnson",
    date: "Tomorrow",
    time: "10:00 AM",
    attendees: 89,
    maxCapacity: 100,
    status: "upcoming",
  },
  {
    id: 3,
    title: "Leadership Roundtable",
    instructor: "Dr. Emily Wong",
    date: "Dec 30",
    time: "3:30 PM",
    attendees: 67,
    maxCapacity: 80,
    status: "upcoming",
  },
];

export function LiveClassStats() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "500ms" }}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Video className="w-5 h-5 text-live-classes" />
          Live Classes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {liveClasses.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">{session.title}</h4>
                <p className="text-xs text-muted-foreground">
                  by {session.instructor}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  session.status === "live"
                    ? "border-destructive text-destructive animate-pulse"
                    : "border-muted-foreground text-muted-foreground"
                }
              >
                {session.status === "live" ? "● LIVE" : "Upcoming"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {session.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {session.time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {session.attendees}/{session.maxCapacity}
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-live-classes rounded-full"
                style={{
                  width: `${(session.attendees / session.maxCapacity) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
