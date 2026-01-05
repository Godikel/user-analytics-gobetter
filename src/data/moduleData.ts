// Shared module data to ensure consistency between stats cards and tables

export interface ModuleStats {
  completed: number;
  distributed: number;
}

// Fixed counts for each module type
export const moduleStats: Record<string, ModuleStats> = {
  courses: { completed: 10, distributed: 18 },
  assessments: { completed: 12, distributed: 25 },
  surveys: { completed: 3, distributed: 5 },
  learningJourneys: { completed: 2, distributed: 5 },
  ilts: { completed: 3, distributed: 5 },
  feeds: { completed: 8, distributed: 12 },
};

export function getModuleStatsForUser() {
  return {
    courses: moduleStats.courses,
    assessments: moduleStats.assessments,
    surveys: moduleStats.surveys,
    learningJourneys: moduleStats.learningJourneys,
    ilts: moduleStats.ilts,
    feeds: moduleStats.feeds,
  };
}
