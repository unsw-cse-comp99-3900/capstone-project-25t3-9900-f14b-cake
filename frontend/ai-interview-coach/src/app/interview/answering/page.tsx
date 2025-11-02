"use client";

import { useState, useEffect, useRef } from "react";
import { PlayIcon, StopIcon, MicrophoneIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { interviewService } from "@/features/interview/services";
import { speechToTextService } from "@/utils/speechToText";
import "./type";

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

  // Feedback state for all questions
  const [feedbacks, setFeedbacks] = useState<Record<number, {
    text: string | null;
    scores: number[] | null;
    error: boolean;
    loading: boolean;
  }>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [isRecordingForTranscription, setIsRecordingForTranscription] = useState(false);
  const [transcriptionRecorder, setTranscriptionRecorder] = useState<MediaRecorder | null>(null);
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Manage webcam preview when the transcription modal is open
  useEffect(() => {
    let active = true;
    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        setPreviewStream(stream);
        if (videoRef.current) {
          // @ts-ignore - srcObject is supported in modern browsers
          videoRef.current.srcObject = stream as any;
        }
      } catch (e) {
        // If camera permission denied, silently ignore and keep modal without preview
      }
    };

    if (showTranscriptionModal) {
      startPreview();
    } else {
      if (previewStream) {
        previewStream.getTracks().forEach((t) => t.stop());
        setPreviewStream(null);
      }
    }

    return () => {
      active = false;
    };
  }, [showTranscriptionModal]);

  // Show feedback when switching to a question that has feedback
  useEffect(() => {
    const currentFeedback = getCurrentFeedback();
    setShowFeedback(!!currentFeedback.text || currentFeedback.error);
  }, [currentQuestionIndex]);

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
    
    // Start real-time transcription instead of recording
    try {
      setShowTranscriptionModal(true);
      setIsTranscribing(true);
      
      const result = await speechToTextService.transcribeWithWebSpeech();
      setCurrentAnswer({ transcribedText: result.transcript });
      setShowTranscriptionModal(false);
      setIsTranscribing(false);
    } catch (err) {
      console.error('Failed to start transcription', err);
      setShowTranscriptionModal(false);
      setIsTranscribing(false);
    }
  };

  const stopRecording = () => {
    // Stop the speech recognition
    speechToTextService.stop();
    setShowTranscriptionModal(false);
    setIsTranscribing(false);
  };

  const reRecord = () => {
    // Clear previous transcription and start new one
    setCurrentAnswer({ transcribedText: null });
    startRecording();
  };

  const [answers, setAnswers] = useState<Record<number, { textAnswer: string; transcribedText: string | null }>>({});

  // Helper functions to get/set current question's answer
  const getCurrentAnswer = () => {
    return answers[currentQuestionIndex] || { textAnswer: "", transcribedText: null };
  };

  const setCurrentAnswer = (updates: Partial<{ textAnswer: string; transcribedText: string | null }>) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        textAnswer: "",
        transcribedText: null,
        ...updates
      }
    }));
  };

  // Helper functions to get/set current question's feedback
  const getCurrentFeedback = () => {
    return feedbacks[currentQuestionIndex] || { text: null, scores: null, error: false, loading: false };
  };

  const setCurrentFeedback = (updates: Partial<{ text: string | null; scores: number[] | null; error: boolean; loading: boolean }>) => {
    setFeedbacks(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        text: null,
        scores: null,
        error: false,
        loading: false,
        ...updates
      }
    }));
  };

  const startRealTimeTranscription = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!speechToTextService.isSupported()) {
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      setShowTranscriptionModal(true);
      setIsTranscribing(true);

      // Start real-time speech recognition
      speechToTextService.transcribeWithWebSpeech()
        .then((result) => {
          setCurrentAnswer({ transcribedText: result.transcript });
          setShowTranscriptionModal(false);
          setIsTranscribing(false);
          resolve(result.transcript);
        })
        .catch((error) => {
          console.warn('Real-time transcription failed:', error);
          setShowTranscriptionModal(false);
          setIsTranscribing(false);
          reject(error);
        });
    });
  };

  const handleSubmitAnswer = async () => {
    if (!questions.length) return;
    
    let answer = "";
    
    if (mode === "audio") {
      if (!getCurrentAnswer().transcribedText) {
        setCurrentFeedback({ text: "Please record your answer first.", error: true });
        setShowFeedback(true);
        return;
      }
      answer = getCurrentAnswer().transcribedText!;
    } else {
      answer = getCurrentAnswer().textAnswer.trim();
      if (!answer) return;
    }

    try {
      setCurrentFeedback({ loading: true });
      const res = await interviewService.feedback({
        interview_question: questionText,
        interview_answer: answer,
      });
      setCurrentFeedback({ 
        text: res.interview_feedback, 
        scores: res.interview_score, 
        error: false, 
        loading: false 
      });
      setShowFeedback(true);
      
      // Mark current question as answered
      setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
    } catch (e) {
      setCurrentFeedback({ 
        text: "Failed to generate feedback. Please try again.", 
        error: true, 
        loading: false 
      });
      setShowFeedback(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = questions.length > 0 && answeredQuestions.size === questions.length;

  const handleCompleteInterview = () => {
    // Navigate back to home or show completion message
    router.push('/home');
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
            {!isLastQuestion ? (
              <button
                onClick={() => setCurrentQuestionIndex((q) => Math.min(q + 1, Math.max(0, questions.length - 1)))}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCompleteInterview}
                disabled={!allQuestionsAnswered}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  allQuestionsAnswered
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Complete
              </button>
            )}
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
                      {!getCurrentAnswer().transcribedText && !isTranscribing && (
                        <button
                          onClick={startRecording}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <MicrophoneIcon className="h-5 w-5" />
                          <span>Start recording</span>
                        </button>
                      )}
                      {isTranscribing && (
                        <button
                          onClick={stopRecording}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Recording...
                        </button>
                      )}
                      {getCurrentAnswer().transcribedText && !isTranscribing && (
                        <button
                          onClick={reRecord}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                          <span>Re-record</span>
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isTranscribing ? 'Recording...' : getCurrentAnswer().transcribedText ? 'Transcription ready' : 'Click start to record'}
                    </div>
                    {getCurrentAnswer().transcribedText && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Transcribed Answer:</h4>
                        <p className="text-sm text-gray-700">{getCurrentAnswer().transcribedText}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    placeholder="Type your answer here..."
                    value={getCurrentAnswer().textAnswer}
                    onChange={(e) => setCurrentAnswer({ textAnswer: e.target.value })}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={getCurrentFeedback().loading || (mode === 'audio' && !getCurrentAnswer().transcribedText) || (mode === 'text' && !getCurrentAnswer().textAnswer.trim())}
                    className={`px-6 py-2 rounded-lg text-white ${getCurrentFeedback().loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                  >
                    {getCurrentFeedback().loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback</h3>
                {mode === "audio" && getCurrentAnswer().transcribedText && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Transcribed Answer:</h4>
                    <p className="text-sm text-gray-700">{getCurrentAnswer().transcribedText}</p>
                  </div>
                )}
                <p className="text-gray-700 whitespace-pre-line mb-6">{getCurrentFeedback().text || 'No feedback'}</p>
                {getCurrentFeedback().scores && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Performance Scores</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Clarity & Structure", description: "How clear and well-structured your answer is", score: getCurrentFeedback().scores![0] },
                        { name: "Relevance to Question/Job", description: "How relevant your answer is to the question and job", score: getCurrentFeedback().scores![1] },
                        { name: "Keyword & Skill Alignment", description: "How well you used relevant keywords and skills", score: getCurrentFeedback().scores![2] },
                        { name: "Confidence & Delivery", description: "How confident and well-delivered your answer was", score: getCurrentFeedback().scores![3] },
                        { name: "Conciseness & Focus", description: "How concise and focused your answer was", score: getCurrentFeedback().scores![4] }
                      ].map((item, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-800 text-sm">{item.name}</h5>
                            <div className="flex items-center">
                              <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                                item.score >= 4 ? 'bg-green-100 text-green-800' :
                                item.score >= 3 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.score}/5
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">{item.description}</p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                item.score >= 4 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                item.score >= 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                'bg-gradient-to-r from-red-400 to-red-500'
                              }`}
                              style={{ width: `${(item.score / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Overall Performance</span>
                        <span className="text-lg font-bold text-blue-900">
                          {Math.round(getCurrentFeedback().scores!.reduce((a, b) => a + b, 0) / getCurrentFeedback().scores!.length)}/5
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {getCurrentFeedback().error && (
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

      {/* Transcription Modal */}
      {showTranscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg w-[28rem] max-w-[90vw] relative border border-blue-100">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-4">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Listening...</h3>
                <p className="text-gray-600 text-sm">
                  Please speak your answer clearly. The system will automatically stop when you finish speaking.
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    speechToTextService.stop();
                    setShowTranscriptionModal(false);
                    setIsTranscribing(false);
                  }}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Stop Listening
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
