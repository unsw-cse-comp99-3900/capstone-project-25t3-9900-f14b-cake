"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface FeedbackData {
  questions: string[];
  answers: Record<number, { textAnswer: string; transcribedText: string | null }>;
  feedbacks: Record<number, { text: string | null; scores: number[] | null; error: boolean; loading: boolean }>;
  questionType: string;
  mode: string;
  timeElapsed: number;
}

export default function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);

  useEffect(() => {
    // Get data from sessionStorage (passed from answering page)
    const stored = sessionStorage.getItem("interview_feedback_data");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setFeedbackData(data);
      } catch (e) {
        console.error("Failed to parse feedback data", e);
      }
    }
  }, []);

  if (!feedbackData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 p-5 pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <p className="text-gray-600">Loading feedback...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { questions, answers, feedbacks, questionType, mode, timeElapsed } = feedbackData;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnswerText = (index: number): string => {
    const answer = answers[index];
    if (!answer) return "No answer provided";
    if (mode === "audio" && answer.transcribedText) {
      return answer.transcribedText;
    }
    return answer.textAnswer || "No answer provided";
  };

  const getFeedback = (index: number) => {
    return feedbacks[index] || { text: null, scores: null, error: false, loading: false };
  };

  const getScoreAverage = (scores: number[] | null): number | null => {
    if (!scores || scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 4) return 'bg-green-100 text-green-800';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const getProgressColor = (score: number): string => {
    if (score >= 4) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (score >= 3) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };
  
  const scoreLabels = [
    { name: "Clarity & Structure", description: "How clear and well-structured your answer is" },
    { name: "Relevance to Question/Job", description: "How relevant your answer is to the question and job" },
    { name: "Keyword & Skill Alignment", description: "How well you used relevant keywords and skills" },
    { name: "Confidence & Delivery", description: "How confident and well-delivered your answer was" },
    { name: "Conciseness & Focus", description: "How concise and focused your answer was" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-5 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Interview Feedback - {questionType.charAt(0).toUpperCase() + questionType.slice(1)}
              </h1>
              <div className="text-lg text-gray-600">
                Total Time: {formatTime(timeElapsed)}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 gap-4">
              <span>Mode: {mode === "audio" ? "Audio" : "Text"}</span>
              <span>Total Questions: {questions.length}</span>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Object.values(feedbacks).filter(f => f.scores !== null && f.scores.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const allScores = Object.values(feedbacks)
                      .flatMap(f => f.scores || []);
                    if (allScores.length === 0) return "N/A";
                    const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
                    return avg.toFixed(1);
                  })()}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((question, index) => {
              const answer = getAnswerText(index);
              const feedback = getFeedback(index);
              const avgScore = getScoreAverage(feedback.scores);

              return (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  {/* Question Number Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      Question {index + 1}
                    </span>
                    {avgScore !== null && (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(avgScore)}`}>
                        Score: {avgScore}/5
                      </span>
                    )}
                  </div>

                  {/* Question */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Question:</h3>
                    <p className="text-gray-900 text-lg leading-relaxed">{question}</p>
                  </div>

                  {/* Answer */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Your Answer:</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {answer}
                      </p>
                    </div>
                  </div>

                  {/* Feedback */}
                  {feedback.text && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Feedback:</h3>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {feedback.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Scores Breakdown */}
                  {feedback.scores && feedback.scores.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-3">Performance Scores</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedback.scores.map((score, scoreIndex) => {
                          const label = scoreLabels[scoreIndex] || { name: `Criterion ${scoreIndex + 1}`, description: "" };
                          return (
                            <div key={scoreIndex} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-800 text-sm">{label.name}</h5>
                                <div className="flex items-center">
                                  <span className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(score)}`}>
                                    {score}/5
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600">{label.description}</p>
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(score)}`}
                                  style={{ width: `${(score / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">Overall Performance</span>
                          <span className="text-lg font-bold text-blue-900">
                            {avgScore}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {feedback.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">Failed to generate feedback for this answer.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => router.push('/interview')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start New Interview
            </button>
            <button
              onClick={() => router.push('/home')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

