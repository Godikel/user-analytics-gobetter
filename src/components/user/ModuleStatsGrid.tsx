import { Card } from "@/components/ui/card";
import { User } from "@/data/users";
import { BookOpen, ClipboardCheck, MessageSquare, Route, Video, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleStatsGridProps {
  modules: User["modules"];
}

const moduleConfig = [
  { key: "courses", label: "Courses", icon: BookOpen, colorClass: "text-courses border-courses/30 bg-courses/10" },
  { key: "assessments", label: "Assessments", icon: ClipboardCheck, colorClass: "text-assessments border-assessments/30 bg-assessments/10" },
  { key: "surveys", label: "Surveys", icon: MessageSquare, colorClass: "text-surveys border-surveys/30 bg-surveys/10" },
  { key: "learningJourneys", label: "Learning Journeys", icon: Route, colorClass: "text-journeys border-journeys/30 bg-journeys/10" },
  { key: "ilts", label: "ILTs", icon: Video, colorClass: "text-live-classes border-live-classes/30 bg-live-classes/10" },
  { key: "feeds", label: "Feeds", icon: Newspaper, colorClass: "text-feeds border-feeds/30 bg-feeds/10" },
];

export function ModuleStatsGrid({ modules }: ModuleStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
      {moduleConfig.map((config, index) => {
        const module = modules[config.key as keyof User["modules"]];
        const percentage = module.distributed > 0 
          ? Math.round((module.completed / module.distributed) * 100) 
          : 0;
        const Icon = config.icon;
        
        return (
          <Card 
            key={config.key}
            className={cn(
              "p-4 border-2 transition-all hover:scale-105 cursor-pointer",
              config.colorClass
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium truncate">{config.label}</span>
            </div>
            <div className="text-2xl font-bold font-mono">
              {module.completed}/{module.distributed}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {percentage}% complete
            </div>
          </Card>
        );
      })}
    </div>
  );
}
