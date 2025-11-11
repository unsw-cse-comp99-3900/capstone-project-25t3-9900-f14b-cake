// Backend API response types
export interface BackendQuestionDetail {
  question_id: string;
  question: string;
  answer: string;
  feedback: {
    clarity_structure_score?: number;
    clarity_structure_feedback?: string;
    relevance_score?: number;
    relevance_feedback?: string;
    keyword_alignment_score?: number;
    keyword_alignment_feedback?: string;
    confidence_score?: number;
    confidence_feedback?: string;
    conciseness_score?: number;
    conciseness_feedback?: string;
    overall_score?: number;
    overall_summary?: string;
  };
  timestamp: number;
}

export interface BackendInterviewDetail {
  interview_id: string;
  interview_time: number;
  interview_type?: string; // Type of interview: technical, behavioural, psychometric
  is_like: number | boolean;
  questions: BackendQuestionDetail[];
}

export interface BackendUserDetailResponse {
  user_id: string;
  user_email: string;
  xp: number;
  total_interviews: number;
  total_questions: number;
  interviews: BackendInterviewDetail[];
  badges: Array<{
    badge_id: number;
    unlock_date: number;
  }>;
}
