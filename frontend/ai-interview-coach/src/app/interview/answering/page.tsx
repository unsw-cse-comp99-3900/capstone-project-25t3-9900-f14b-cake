"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AnsweringPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const questionType = searchParams.get("type") || "behavioural";
  const mode = searchParams.get("mode") || "text";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

          {/* Top controls */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => {
                if (currentQuestion <= 1) {
                  setShowExitConfirm(true);
                  return;
                }
                setCurrentQuestion((q) => Math.max(1, q - 1));
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestion((q) => q + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>

          {/* Current question */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Current question
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Please describe the most challenging situation you encountered at work and how you addressed it. Explain your thought process, actions taken, and the final outcome.
            </p>
          </div>

          {/* Answer area */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your answer
            </h3>
            
            {mode === "audio" ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span>Start recording</span>
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Stop recording
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Recording duration: 00:00
                </div>
              </div>
            ) : (
              <textarea
                placeholder="Type your answer here..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
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
