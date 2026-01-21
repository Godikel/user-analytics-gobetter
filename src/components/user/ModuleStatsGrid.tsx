import { getModuleStatsForUser } from "@/data/moduleData";

interface ModuleStatsGridProps {
  onModuleClick?: (tabValue: string) => void;
}

const moduleConfig = [
  { key: "courses", tabValue: "courses", label: "Courses" },
  { key: "assessments", tabValue: "assessments", label: "Assessments" },
  { key: "surveys", tabValue: "surveys", label: "Surveys" },
  { key: "learningJourneys", tabValue: "journeys", label: "Learning Journeys" },
  { key: "ilts", tabValue: "ilts", label: "ILTs" },
];

export function ModuleStatsGrid({ onModuleClick }: ModuleStatsGridProps) {
  const modules = getModuleStatsForUser();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {moduleConfig.map((config) => {
        const module = modules[config.key as keyof typeof modules];
        
        return (
          <div 
            key={config.key}
            onClick={() => onModuleClick?.(config.tabValue)}
            className="bg-muted/50 rounded-md p-4 cursor-pointer hover:bg-muted/70 transition-colors"
          >
            <div className="text-sm text-muted-foreground mb-2">
              {config.label}
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {module.completed}/{module.distributed}
            </div>
          </div>
        );
      })}
    </div>
  );
}
