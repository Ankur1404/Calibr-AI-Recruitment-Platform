
"use client";
import { useEffect, useState } from "react";
import { getCandidateDashboardData } from "./actions";


export default function Page() {
  const candidateId = "64e9b2f1c2a4f1e5b8a1d2c3";
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const result = await getCandidateDashboardData(candidateId);
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  const { candidate, assessments, interviews, overallPerformance } = data || {};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>

      {/* Profile */}
      {candidate ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <ul className="mb-4">
            <li><strong>Name:</strong> {candidate.firstName} {candidate.lastName}</li>
            <li><strong>Email:</strong> {candidate.email}</li>
            <li><strong>Bio:</strong> {candidate.bio}</li>
            <li><strong>Verified:</strong> {candidate.isVerified ? "Yes" : "No"}</li>
          </ul>
        </div>
      ) : (
        <div className="mb-8 text-red-600">Candidate not found.</div>
      )}

      {/* Overall Performance Stats */}
      {overallPerformance && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Performance Stats</h2>
          <ul className="mb-4">
            <li><strong>Overall Score:</strong> {overallPerformance.overallScore}%</li>
            <li><strong>Skill Level:</strong> {overallPerformance.skillLevel}</li>
            <li><strong>Total Assessments:</strong> {overallPerformance.totalAssessments}</li>
            <li><strong>Completed Assessments:</strong> {overallPerformance.completedAssessments}</li>
            <li><strong>Last Completed At:</strong> {overallPerformance.lastCompletedAt ? new Date(overallPerformance.lastCompletedAt).toLocaleString() : "N/A"}</li>
          </ul>
          {/* Assessment breakdown by type */}
          <h3 className="text-lg font-semibold mb-2">Assessment Breakdown</h3>
          {overallPerformance.byType && Object.keys(overallPerformance.byType).length > 0 ? (
            <ul>
              {Object.entries(overallPerformance.byType).map(([type, stats]: any) => (
                <li key={type} className="mb-2">
                  <strong>{type}:</strong> Avg Score: {stats.avgScore}, Count: {stats.count}, Weight: {stats.weight}
                </li>
              ))}
            </ul>
          ) : (
            <div>No assessment breakdown available.</div>
          )}
        </div>
      )}

      {/* Assessments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Assessments</h2>
        {assessments && assessments.length > 0 ? (
          <ul>
            {assessments.map((a: any) => (
              <li key={a._id} className="mb-2">
                <strong>Type:</strong> {a.type} | <strong>Score:</strong> {a.score} | <strong>Completed At:</strong> {a.completedAt ? new Date(a.completedAt).toLocaleString() : "Not completed"}
              </li>
            ))}
          </ul>
        ) : (
          <div>No assessments found.</div>
        )}
      </div>

      {/* Interviews */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Interviews</h2>
        {interviews && interviews.length > 0 ? (
          <ul>
            {interviews.map((i: any) => (
              <li key={i._id} className="mb-2">
                <strong>Interviewer:</strong> {i.interviewerName} | <strong>Status:</strong> {i.status} | <strong>Scheduled At:</strong> {i.scheduledAt ? new Date(i.scheduledAt).toLocaleString() : "Not scheduled"} {i.score !== undefined && i.score !== null ? <>| <strong>Score:</strong> {i.score}</> : null}
              </li>
            ))}
          </ul>
        ) : (
          <div>No interviews found.</div>
        )}
      </div>

      {/* Interview Stats */}
      {overallPerformance && overallPerformance.interviews && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Interview Stats</h2>
          <ul className="mb-4">
            <li><strong>Total Interviews:</strong> {overallPerformance.interviews.total}</li>
            <li><strong>Completed Interviews:</strong> {overallPerformance.interviews.completed}</li>
            <li><strong>Upcoming Interviews:</strong> {overallPerformance.interviews.upcoming}</li>
            <li><strong>Average Interview Score:</strong> {overallPerformance.interviews.avgScore}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

