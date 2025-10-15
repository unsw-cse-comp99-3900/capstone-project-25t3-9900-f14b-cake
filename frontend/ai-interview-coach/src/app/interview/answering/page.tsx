"use client";

import { useState, useEffect } from "react";
import { PlayIcon, StopIcon, MicrophoneIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { interviewService } from "@/features/interview/services";

export default function AnsweringPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const questionType = searchParams.get("type") || "behavioural";
  const mode = searchParams.get("mode") || "text";

  const jobDescription = searchParams.get("job") || "";
  const questionText = questions[currentQuestionIndex] || "Loading question...";

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useState<Blob[]>([])[0];

  // Feedback state for current question
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [feedbackScores, setFeedbackScores] = useState<number[] | null>(null);
  const [feedbackError, setFeedbackError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch questions when page loads
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        const res = await interviewService.start({
          question_type: questionType as any,
          job_description: jobDescription || undefined,
        });
        if (!isCancelled) {
          setQuestions(res.interview_questions || []);
        }
      } catch (e) {
        if (!isCancelled) {
          setQuestions([]);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [questionType, jobDescription]);

  // Cleanup any ongoing speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayQuestion = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;

    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.length = 0;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setIsRecording(false);
        // stop tracks
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecordedUrl(null);
      setIsRecording(true);
    } catch (err) {
      // permission denied or not supported
      console.error('Failed to start recording', err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  const reRecord = () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }
    startRecording();
  };

  const [textAnswer, setTextAnswer] = useState("");

  const handleSubmitAnswer = async () => {
    if (!questions.length) return;
    const answer = mode === "audio" ? (recordedUrl ? "[audio answer submitted]" : "") : textAnswer.trim();
    if (!answer) return;
    try {
      setFeedbackLoading(true);
      const res = await interviewService.feedback({
        interview_question: questionText,
        interview_answer: answer,
      });
      setFeedbackText(res.interview_feedback);
      setFeedbackScores(res.interview_score);
      setShowFeedback(true);
      setFeedbackError(false);
    } catch (e) {
      setFeedbackText("Failed to generate feedback. Please try again.");
      setShowFeedback(true);
      setFeedbackError(true);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 p-5 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Answering - {questionType} interview
              </h1>
              <div className="text-lg font-mono text-gray-600">
                {formatTime(timeElapsed)}
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <span>Mode: {mode === "audio" ? "Audio" : "Text"}</span>
            </div>
          </div>

          {/* Question list + progress */}
          <div className="mb-6">
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>
                  {questions.length > 0 ? `Question ${currentQuestionIndex + 1} of ${questions.length}` : "Preparing questions..."}
                </span>
                {questions.length > 0 && (
                  <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                )}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Question chips */}
            <div className="flex flex-wrap gap-2">
              {questions.map((_, idx) => {
                const isActive = idx === currentQuestionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                    aria-label={`Go to question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top controls */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => {
                if (currentQuestionIndex <= 0) {
                  setShowExitConfirm(true);
                  return;
                }
                setCurrentQuestionIndex((q) => Math.max(0, q - 1));
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestionIndex((q) => Math.min(q + 1, Math.max(0, questions.length - 1)))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>

          {/* Current question */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Current question</h2>
              <button
                onClick={handlePlayQuestion}
                className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center"
                aria-label="Play question"
                title={isSpeaking ? "Stop" : "Play"}
              >
                {isSpeaking ? (
                  <StopIcon className="h-5 w-5" />
                ) : (
                  <PlayIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {loading ? "Loading..." : questionText || "No question available."}
            </p>
          </div>

          {/* Answer or Feedback area */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {!showFeedback ? (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your answer</h3>
                {mode === "audio" ? (
                  <div className="space-y-4">
                    {/* Controls */}
                    <div className="flex items-center space-x-4">
                      {!isRecording && !recordedUrl && (
                        <button
                          onClick={startRecording}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <MicrophoneIcon className="h-5 w-5" />
                          <span>Start recording</span>
                        </button>
                      )}
                      {isRecording && (
                        <button
                          onClick={stopRecording}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Stop recording
                        </button>
                      )}
                      {recordedUrl && !isRecording && (
                        <>
                          <audio src={recordedUrl} controls className="h-10" />
                          <button
                            onClick={reRecord}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            <ArrowPathIcon className="h-5 w-5" />
                            <span>Re-record</span>
                          </button>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isRecording ? 'Recording...' : recordedUrl ? 'Recorded audio ready' : 'Click start to record'}
                    </div>
                  </div>
                ) : (
                  <textarea
                    placeholder="Type your answer here..."
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={feedbackLoading || (!recordedUrl && mode === 'audio') || (mode === 'text' && !textAnswer.trim())}
                    className={`px-6 py-2 rounded-lg text-white ${feedbackLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                  >
                    {feedbackLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback</h3>
                <p className="text-gray-700 whitespace-pre-line mb-4">{feedbackText || 'No feedback'}</p>
                {feedbackScores && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold">Scores:</span>
                    {feedbackScores.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{s}</span>
                    ))}
                  </div>
                )}
                {feedbackError && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowFeedback(false)}
                      className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            <p className="text-center text-gray-800 text-lg leading-relaxed">
              Would you like to end this interview? Exiting now will not generate an interview record.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => router.push('/interview')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                confirm
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
