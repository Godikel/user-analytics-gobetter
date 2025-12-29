import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const courses = [
  {
    id: 1,
    name: "Leadership Fundamentals",
    chapters: 8,
    enrolled: 1234,
    completion: 78,
    status: "active",
  },
  {
    id: 2,
    name: "Data Analytics Masterclass",
    chapters: 12,
    enrolled: 892,
    completion: 65,
    status: "active",
  },
  {
    id: 3,
    name: "Project Management Pro",
    chapters: 6,
    enrolled: 2156,
    completion: 92,
    status: "completed",
  },
  {
    id: 4,
    name: "Communication Skills",
    chapters: 5,
    enrolled: 678,
    completion: 45,
    status: "in-progress",
  },
  {
    id: 5,
    name: "Strategic Thinking",
    chapters: 10,
    enrolled: 445,
    completion: 23,
    status: "new",
  },
];

export function CourseProgressTable() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "300ms" }}>
      <CardHeader>
        <CardTitle className="text-lg">Course Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{course.name}</h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs capitalize",
                      course.status === "active" && "border-courses text-courses",
                      course.status === "completed" && "border-live-classes text-live-classes",
                      course.status === "in-progress" && "border-journeys text-journeys",
                      course.status === "new" && "border-assessments text-assessments"
                    )}
                  >
                    {course.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{course.chapters} chapters</span>
                  <span>•</span>
                  <span>{course.enrolled.toLocaleString()} enrolled</span>
                </div>
              </div>
              <div className="w-32 flex items-center gap-3">
                <Progress value={course.completion} className="h-2" />
                <span className="text-sm font-mono text-muted-foreground w-10">
                  {course.completion}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
