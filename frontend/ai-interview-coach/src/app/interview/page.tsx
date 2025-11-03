"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Navbar from "@/components/Navbar";

export default function InterviewPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Interview Setup</h1>
            <p className="text-lg text-gray-600">Configure your personalized mock interview</p>
          </div>

          <div className="modern-card p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Question Type
                </label>
                <FormControl fullWidth>
                  <InputLabel id="question-type-label">
                    Please select question type
                  </InputLabel>
                  <Select
                    labelId="question-type-label"
                    id="questionType"
                    value={questionType}
                    label="Please select question type"
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="rounded-xl"
                  >
                    <MenuItem value="behavioural">Behavioural</MenuItem>
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="psychometric">Psychometric</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div>
                <label
                  htmlFor="jobDescription"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Job Description (Optional)
                </label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get more targeted questions..."
                  className="w-full h-48 resize-y border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowModal(true)}
                  disabled={!questionType}
                  className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
                    questionType
                      ? "btn-primary"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Start Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="modern-card p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Answer Mode</h3>
              <p className="text-gray-600">
                How would you like to answer the interview questions?
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => {
                  const params = new URLSearchParams();
                  if (jobDescription.trim()) params.set("job", jobDescription.trim());
                  params.set("type", questionType);
                  params.set("mode", "audio");
                  router.push(`/interview/answering?${params.toString()}`);
                }}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-blue-600">mic</span>
                  <span className="font-semibold text-gray-900">Audio Recording</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Speak your answers naturally</p>
              </button>

              <button 
                onClick={() => {
                  const params = new URLSearchParams();
                  if (jobDescription.trim()) params.set("job", jobDescription.trim());
                  params.set("type", questionType);
                  params.set("mode", "text");
                  router.push(`/interview/answering?${params.toString()}`);
                }}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-blue-600">edit</span>
                  <span className="font-semibold text-gray-900">Text Input</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Type your answers</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
