"use server";
import Candidate from "@/models/candidate.model";
import AssessmentModel from "@/models/assessment.model";
import InterviewModel from "@/models/interview.model";
import { connectToDatabase } from "@/utils/connectDb";
import type { CandidatePerformanceStats } from "./types.d.ts";

const SCORE_WEIGHTS: Record<string, number> = {
  technical: 0.4,
  softskills: 0.3,
  industry: 0.3,
};

function mapSkillLevel(score: number) {
  if (score <= 40) return "Beginner";
  if (score <= 60) return "Intermediate";
  if (score <= 80) return "Advanced";
  return "Expert";
}

export async function getCandidateDashboardData(candidateId: string) {
  await connectToDatabase();
  try {
    const candidate = await Candidate.findById(candidateId).lean();

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const assessments = await AssessmentModel.find({ candidateId }).lean();
    const interviews = await InterviewModel.find({ candidateId }).lean();
    const overallPerformance = await getCandidatePerformanceStats(candidateId);

    return {
      candidate,
      assessments,
      interviews,
      overallPerformance,
    };
  } catch (err: any) {
    console.error(`[getCandidateDashboardData] Error:`, err.message);
    throw new Error("Failed to fetch candidate dashboard data");
  }
}

export async function getCandidateProfile(candidateId: string) {
  await connectToDatabase();
  try {
    const candidate = await Candidate.findById(candidateId)
      .select("-password")
      .lean();

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    return candidate;
  } catch (err: any) {
    console.error(`[getCandidateProfile] Error:`, err.message);
    throw new Error("Failed to fetch candidate profile");
  }
}

export async function getCandidatePerformanceStats(
  candidateId: string
): Promise<CandidatePerformanceStats> {
  await connectToDatabase();
  try {
    // ---------------- Assessment pipeline ----------------
    const pipeline = [
      { $match: { candidateId, completedAt: { $ne: null } } },
      { $match: { score: { $gte: 0, $lte: 100 } } },
      {
        $group: {
          _id: "$type",
          avgScore: { $avg: "$score" },
          count: { $sum: 1 },
          lastCompletedAt: { $max: "$completedAt" },
        },
      },
    ];

    const [completedDocs, totalCount, interviews] = await Promise.all([
      AssessmentModel.aggregate(pipeline),
      AssessmentModel.countDocuments({ candidateId }),
      InterviewModel.find({ candidateId }).lean(),
    ]);

    // ---------------- Interview stats ----------------
    const completedInterviews = interviews.filter((i) => i.score != null);
    const upcomingInterviews = interviews.filter(
      (i) => i.scheduledAt && new Date(i.scheduledAt) > new Date()
    );

    const interviewAvgScore =
      completedInterviews.length > 0
        ? completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) /
          completedInterviews.length
        : 0;

    // ---------------- Empty case ----------------
    if (totalCount === 0 && interviews.length === 0) {
      return {
        overallScore: 0,
        skillLevel: mapSkillLevel(0),
        totalAssessments: 0,
        completedAssessments: 0,
        byType: {},
        lastCompletedAt: null,
        interviews: {
          total: 0,
          completed: 0,
          upcoming: 0,
          avgScore: 0,
        },
      };
    }

    // ---------------- Assessments processing ----------------
    const byType: CandidatePerformanceStats["byType"] = {};
    let weightedSum = 0;
    let weightTotal = 0;
    let lastCompletedAt: Date | null = null;

    for (const doc of completedDocs) {
      const type: string = doc._id;
      const weight = SCORE_WEIGHTS[type] ?? 0;
      const avgScore = Number(doc.avgScore?.toFixed(2)) || 0;
      byType[type] = { avgScore, count: doc.count, weight };
      weightedSum += avgScore * weight;
      weightTotal += weight;

      if (
        !lastCompletedAt ||
        (doc.lastCompletedAt && doc.lastCompletedAt > lastCompletedAt)
      ) {
        lastCompletedAt = doc.lastCompletedAt;
      }
    }

    // If no assessments but interviews exist
    if (Object.keys(byType).length === 0) {
      return {
        overallScore: 0,
        skillLevel: mapSkillLevel(0),
        totalAssessments: totalCount,
        completedAssessments: 0,
        byType: {},
        lastCompletedAt: null,
        interviews: {
          total: interviews.length,
          completed: completedInterviews.length,
          upcoming: upcomingInterviews.length,
          avgScore: Number(interviewAvgScore.toFixed(2)),
        },
      };
    }

    // ---------------- Final calculation ----------------
    const normalizationFactor = weightTotal === 0 ? 1 : 1 / weightTotal;
    const overallScore = Number((weightedSum * normalizationFactor).toFixed(2));
    const skillLevel = mapSkillLevel(overallScore);

    return {
      overallScore,
      skillLevel,
      totalAssessments: totalCount,
      completedAssessments: completedDocs.reduce((a, d) => a + d.count, 0),
      byType,
      lastCompletedAt,
      interviews: {
        total: interviews.length,
        completed: completedInterviews.length,
        upcoming: upcomingInterviews.length,
        avgScore: Number(interviewAvgScore.toFixed(2)),
      },
    };
  } catch (err: any) {
    console.error(`[getCandidatePerformanceStats] Error:`, err.message);

    return {
      overallScore: 0,
      skillLevel: mapSkillLevel(0),
      totalAssessments: 0,
      completedAssessments: 0,
      byType: {},
      lastCompletedAt: null,
      interviews: {
        total: 0,
        completed: 0,
        upcoming: 0,
        avgScore: 0,
      },
    };
  }
}
