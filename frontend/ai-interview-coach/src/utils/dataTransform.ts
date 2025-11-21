import type { InterviewRecord } from "@/app/bank/history/type";
import type {
  BackendInterviewDetail,
  BackendQuestionDetail,
} from "@/features/user/type";

// Convert backend interview data format
export const transformInterviewToRecord = (
  interview: BackendInterviewDetail,
  questionType?: string
): InterviewRecord => {
  const finalQuestionType =
    interview.interview_type || questionType || "technical";
  // Calculate total score
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
      feedbacks?: {
        clarity_structure_feedback: string | null;
        relevance_feedback: string | null;
        keyword_alignment_feedback: string | null;
        confidence_feedback: string | null;
        conciseness_feedback: string | null;
      } | null;
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
      feedbacks: {
        clarity_structure_feedback: feedback.clarity_structure_feedback || null,
        relevance_feedback: feedback.relevance_feedback || null,
        keyword_alignment_feedback: feedback.keyword_alignment_feedback || null,
        confidence_feedback: feedback.confidence_feedback || null,
        conciseness_feedback: feedback.conciseness_feedback || null,
      },
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
    mode: "text",
    is_like: interview.is_like, // Preserve is_like status from backend
  };
};

export const transformInterviewsToRecords = (
  interviews: BackendInterviewDetail[]
): InterviewRecord[] => {
  return interviews.map((interview) => transformInterviewToRecord(interview));
};
