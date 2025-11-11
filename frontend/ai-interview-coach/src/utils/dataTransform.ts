import type { InterviewRecord } from "@/app/bank/history/type";
import type {
  BackendInterviewDetail,
  BackendQuestionDetail,
} from "@/features/user/type";

/**
 * Convert backend interview data to frontend InterviewRecord format
 */
export const transformInterviewToRecord = (
  interview: BackendInterviewDetail,
  questionType?: string // Optional override, will use interview.interview_type if not provided
): InterviewRecord => {
  // Use interview_type from backend if available, otherwise use provided questionType or default
  const finalQuestionType =
    interview.interview_type || questionType || "technical";
  // Calculate total score from all questions' feedback
  const scores: number[] = [];
  const answers: Record<
    number,
    { textAnswer: string; transcribedText: string | null }
  > = {};
  const feedbacks: Record<
    number,
    {
      text: string | null;
      scores: number[] | null;
      error: boolean;
      loading: boolean;
    }
  > = {};

  interview.questions.forEach((q, index) => {
    const feedback = q.feedback || {};
    const questionScores = [
      feedback.clarity_structure_score || 0,
      feedback.relevance_score || 0,
      feedback.keyword_alignment_score || 0,
      feedback.confidence_score || 0,
      feedback.conciseness_score || 0,
    ].filter((s) => s > 0);

    if (questionScores.length > 0) {
      scores.push(...questionScores);
    }

    answers[index] = {
      textAnswer: q.answer || "",
      transcribedText: null,
    };

    feedbacks[index] = {
      text: feedback.overall_summary || null,
      scores: questionScores.length > 0 ? questionScores : null,
      error: false,
      loading: false,
    };
  });

  // Calculate average score
  const totalScore =
    scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
        10
      : 0;

  // Calculate time elapsed (estimate: assume 2 minutes per question)
  const timeElapsed = interview.questions.length * 120;

  return {
    id: interview.interview_id,
    questionType: finalQuestionType,
    timeElapsed: timeElapsed,
    createdAt: new Date(interview.interview_time * 1000).toISOString(),
    timestamp: interview.interview_time, // Preserve original Unix timestamp in seconds
    totalScore: totalScore,
    questions: interview.questions.map((q) => q.question),
    answers: answers,
    feedbacks: feedbacks,
    mode: "text", // Default to text mode
    is_like: interview.is_like, // Preserve is_like status from backend
  };
};

/**
 * Transform all backend interviews to frontend records
 */
export const transformInterviewsToRecords = (
  interviews: BackendInterviewDetail[]
): InterviewRecord[] => {
  return interviews.map((interview) => transformInterviewToRecord(interview));
};
