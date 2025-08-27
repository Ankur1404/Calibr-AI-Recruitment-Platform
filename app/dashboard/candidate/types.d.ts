
export interface CandidatePerformanceStats {
  overallScore: number;
  skillLevel: string;
  totalAssessments: number;
  completedAssessments: number;
  byType: {
    [key: string]: {
      avgScore: number;
      count: number;
      weight: number;
    };
  };
  lastCompletedAt: Date | null;
  interviews: {
    total: number;
    completed: number;
    upcoming: number;
    avgScore: number;
  };
}

