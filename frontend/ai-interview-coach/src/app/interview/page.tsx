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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-blue-50">
      <Navbar />

      <main className="flex-1 p-5 pt-24 flex flex-col items-center space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-700 mb-2">AI Interview</h2>
          <p className="text-lg text-gray-600">Start your AI-powered mock interview</p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur rounded-2xl border border-blue-100 shadow-sm p-6 space-y-6">
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
              >
                <MenuItem value="behavioural">behavioural</MenuItem>
                <MenuItem value="technical">technical</MenuItem>
                <MenuItem value="psychometric">psychometric</MenuItem>
              </Select>
            </FormControl>
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here (optional)"
              className="w-full h-48 resize-y border border-blue-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/90"
            />
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={!questionType}
          className={`px-6 py-3 rounded-full text-white text-lg font-medium transition-all
            ${
              questionType
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Start an interview
        </button>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-lg w-96 relative border border-blue-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-blue-600 text-xl"
            >
              x
            </button>

            <p className="text-lg text-gray-800 mb-6">
              Do you prefer to answer the questions in audio or in text?
            </p>

            <div className="flex justify-around">
               <button 
                 onClick={() => {
                   const params = new URLSearchParams();
                   if (jobDescription.trim()) params.set("job", jobDescription.trim());
                   params.set("type", questionType);
                   params.set("mode", "audio");
                   router.push(`/interview/answering?${params.toString()}`);
                 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
               >
                 audio
               </button>
               <button 
                 onClick={() => {
                   const params = new URLSearchParams();
                   if (jobDescription.trim()) params.set("job", jobDescription.trim());
                   params.set("type", questionType);
                   params.set("mode", "text");
                   router.push(`/interview/answering?${params.toString()}`);
                 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
               >
                 text
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
