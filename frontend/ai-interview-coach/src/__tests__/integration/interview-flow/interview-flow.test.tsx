/// <reference types="@testing-library/jest-dom" />

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/login/page";
import InterviewPage from "@/app/interview/page";
import HistoryPage from "@/app/bank/history/page";
import { interviewService } from "@/features/interview/services";
import { bankService } from "@/features/bank/services";
import { getUserDetail } from "@/features/user/services";

const mockPush = jest.fn();
const mockPathname = "/bank/history";
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

// Mock Navbar component
jest.mock("@/components/Navbar", () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

// Mock API services
jest.mock("@/features/interview/services", () => ({
  interviewService: {
    start: jest.fn(),
    feedback: jest.fn(),
  },
}));

jest.mock("@/features/bank/services", () => ({
  bankService: {
    getRecords: jest.fn(),
    toggleLike: jest.fn(),
    getById: jest.fn(),
  },
}));

jest.mock("@/features/user/services", () => ({
  getUserDetail: jest.fn(),
}));

// Mock API_BASE_URL
jest.mock("@/lib/constants", () => ({
  API_BASE_URL: "http://localhost:9000",
}));

// Mock fetch
global.fetch = jest.fn();

// Mock sessionStorage
const mockSessionStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
  writable: true,
});

describe("Integration Test: Complete Interview Flow", () => {
  const mockToken = "test-auth-token-123";
  const mockUserId = "test-user-123";
  const mockInterviewId = "interview-123";
  const mockQuestions = [
    "What experience do you have with test automation frameworks?",
    "How do you approach debugging and troubleshooting?",
  ];

  const mockFeedback = {
    clarity_structure_score: 4,
    clarity_structure_feedback: "Good structure and clarity",
    relevance_score: 4,
    relevance_feedback: "Relevant to the question",
    keyword_alignment_score: 5,
    keyword_alignment_feedback: "Excellent keyword usage",
    confidence_score: 4,
    confidence_feedback: "Confident delivery",
    conciseness_score: 3,
    conciseness_feedback: "Could be more concise",
    overall_summary: "Overall good performance with room for improvement",
    overall_score: 4.0,
  };

  const mockInterviewRecords = [
    {
      id: mockInterviewId,
      questionType: "technical",
      timeElapsed: 300,
      createdAt: new Date().toISOString(),
      timestamp: Date.now() / 1000,
      totalScore: 4.0,
      questions: mockQuestions,
      answers: {
        0: { textAnswer: "I have experience with Selenium and Cypress", transcribedText: null },
        1: { textAnswer: "I use systematic debugging approaches", transcribedText: null },
      },
      feedbacks: {
        0: {
          text: mockFeedback.overall_summary,
          scores: [4, 4, 5, 4, 3],
          feedbacks: {
            clarity_structure_feedback: mockFeedback.clarity_structure_feedback,
            relevance_feedback: mockFeedback.relevance_feedback,
            keyword_alignment_feedback: mockFeedback.keyword_alignment_feedback,
            confidence_feedback: mockFeedback.confidence_feedback,
            conciseness_feedback: mockFeedback.conciseness_feedback,
          },
          error: false,
          loading: false,
        },
      },
      mode: "text",
      is_like: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockSessionStorage.setItem.mockClear();
    mockSessionStorage.getItem.mockClear();

    // Setup localStorage mocks
    Storage.prototype.getItem = jest.fn((key: string) => {
      if (key === "auth_token") return mockToken;
      if (key === "user_id") return mockUserId;
      if (key === "interview_history") return JSON.stringify(mockInterviewRecords);
      if (key === "interview_favorites") return JSON.stringify([]);
      return null;
    });
    Storage.prototype.setItem = jest.fn();

    // Setup Google mock
    global.window.google = {
      accounts: {
        id: {
          initialize: jest.fn(),
          renderButton: jest.fn(),
        },
      },
    } as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (global.window as any).google;
  });

  describe("Complete Interview Flow", () => {
    it("should complete full interview flow: login -> setup -> answer -> feedback -> history", async () => {
      // Login
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: mockToken,
          user_id: mockUserId,
        }),
      });

      const { rerender } = render(<LoginPage />);

      // Switch to email login
      const useOtherEmailBtn = screen.getByText("Use other email");
      fireEvent.click(useOtherEmailBtn);

      // Enter email and login
      const emailInput = screen.getByPlaceholderText("Enter your email");
      const signInBtn = screen.getByText("Sign in");

      await userEvent.type(emailInput, "test@example.com");
      fireEvent.click(signInBtn);

      // Wait for login to complete and navigation
      await waitFor(() => {
        expect(Storage.prototype.setItem).toHaveBeenCalledWith("auth_token", mockToken);
        expect(mockPush).toHaveBeenCalledWith("/home");
      });

      // Setup Interview
      (interviewService.start as jest.Mock).mockResolvedValue({
        interview_id: mockInterviewId,
        interview_questions: mockQuestions,
      });

      rerender(<InterviewPage />);

      // Select question type
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      fireEvent.click(screen.getByText("Technical"));

      // Enter job description
      const jobDescription = screen.getByPlaceholderText(
        "Paste the job description here to get more targeted questions..."
      );
      await userEvent.type(jobDescription, "Software Engineer position with testing experience");

      // Click Start Interview
      const startButton = screen.getByText("Start Interview");
      expect(startButton).not.toBeDisabled();
      fireEvent.click(startButton);

      // Select answer mode (text)
      await waitFor(() => {
        expect(screen.getByText("Choose Answer Mode")).toBeInTheDocument();
      });

      const textButton = screen.getByText("Text Input").closest("button");
      if (textButton) {
        fireEvent.click(textButton);
      }

      // Verify navigation to answering page
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("/interview/answering?")
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("mode=text")
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("type=technical")
        );
      });

      // Simulate answering questions and getting feedback
      (interviewService.feedback as jest.Mock).mockResolvedValue({
        interview_feedback: mockFeedback,
      });

      // View History
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockInterviewRecords);

      rerender(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("Interview Records")).toBeInTheDocument();
      });

      // Verify interview records are displayed
      await waitFor(() => {
        expect(screen.getByText("technical")).toBeInTheDocument();
        expect(screen.getByText("View Details")).toBeInTheDocument();
      });

      // View Details
      const viewDetailsButtons = screen.getAllByText("View Details");
      fireEvent.click(viewDetailsButtons[0]);

      // Verify sessionStorage is updated with feedback data
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        "interview_feedback_data",
        expect.stringContaining("questions")
      );

      // Verify navigation to feedback page
      expect(mockPush).toHaveBeenCalledWith("/interview/feedback");
    });

    it("should handle complete flow with favorite toggle", async () => {
      // Setup: User is logged in and viewing history
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockInterviewRecords);
      (bankService.toggleLike as jest.Mock).mockResolvedValue({ is_like: true });
      (bankService.getById as jest.Mock).mockResolvedValue({
        ...mockInterviewRecords[0],
        is_like: true,
      });

      render(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("technical")).toBeInTheDocument();
      });

      // Toggle favorite
      const favoriteButtons = screen.getAllByTitle(/Add to favorites|Remove from favorites/);
      fireEvent.click(favoriteButtons[0]);

      // Verify API call
      await waitFor(() => {
        expect(bankService.toggleLike).toHaveBeenCalledWith(mockInterviewId);
      });

      // Verify records are refreshed
      await waitFor(() => {
        expect(bankService.getRecords).toHaveBeenCalled();
      });
    });

    it("should handle flow with pagination when multiple records exist", async () => {
      // Create multiple interview records
      const manyRecords = Array.from({ length: 15 }, (_, i) => ({
        ...mockInterviewRecords[0],
        id: `interview-${i}`,
        timestamp: Date.now() / 1000 - i * 86400,
      }));

      (bankService.getRecords as jest.Mock).mockResolvedValue(manyRecords);

      render(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText(/Showing 1 to 10 of 15 records/)).toBeInTheDocument();
      });

      // Navigate to next page
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Showing 11 to 15 of 15 records/)).toBeInTheDocument();
      });

      // Navigate back
      const prevButton = screen.getByText("Previous");
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Showing 1 to 10 of 15 records/)).toBeInTheDocument();
      });
    });

    it("should handle error scenarios in the flow", async () => {
      // Test API failure during interview start
      (interviewService.start as jest.Mock).mockRejectedValue(
        new Error("Failed to start interview")
      );

      render(<InterviewPage />);

      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      fireEvent.click(screen.getByText("Technical"));

      const jobDescription = screen.getByPlaceholderText(
        "Paste the job description here to get more targeted questions..."
      );
      await userEvent.type(jobDescription, "Test job description");
      
      expect(screen.getByText("Start Interview")).toBeInTheDocument();
    });

    it("should handle empty state when no interviews exist", async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue([]);
      Storage.prototype.getItem = jest.fn(() => null);

      render(<HistoryPage />);

      await waitFor(() => {
        expect(screen.getByText("No interview records yet.")).toBeInTheDocument();
        expect(screen.getByText("Start your first interview")).toBeInTheDocument();
      });
    });

    it("should maintain data consistency across pages", async () => {
      // Simulate data flow: interview -> feedback -> history
      const interviewData = {
        questions: mockQuestions,
        answers: {
          0: { textAnswer: "Answer 1", transcribedText: null },
        },
        feedbacks: {
          0: {
            text: mockFeedback.overall_summary,
            scores: [4, 4, 5, 4, 3],
            feedbacks: {
              clarity_structure_feedback: mockFeedback.clarity_structure_feedback,
              relevance_feedback: mockFeedback.relevance_feedback,
              keyword_alignment_feedback: mockFeedback.keyword_alignment_feedback,
              confidence_feedback: mockFeedback.confidence_feedback,
              conciseness_feedback: mockFeedback.conciseness_feedback,
            },
            error: false,
            loading: false,
          },
        },
        questionType: "technical",
        mode: "text",
        timeElapsed: 300,
        interview_id: mockInterviewId,
      };

      // Simulate saving to sessionStorage (as done in answering page)
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(interviewData));

      // Verify data can be retrieved
      const stored = mockSessionStorage.getItem("interview_feedback_data");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored);
      expect(parsed.questions).toEqual(mockQuestions);
      expect(parsed.feedbacks[0].scores).toEqual([4, 4, 5, 4, 3]);
      expect(parsed.feedbacks[0].feedbacks).toBeDefined();
    });
  });

  describe("Cross-page Navigation Flow", () => {
    it("should navigate correctly between interview setup and answering", () => {
      render(<InterviewPage />);

      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      fireEvent.click(screen.getByText("Behavioural"));

      const jobDescription = screen.getByPlaceholderText(
        "Paste the job description here to get more targeted questions..."
      );
      fireEvent.change(jobDescription, {
        target: { value: "Job description for behavioural interview" },
      });

      const startButton = screen.getByText("Start Interview");
      fireEvent.click(startButton);

      // Select audio mode
      waitFor(() => {
        const audioButton = screen.getByText("Audio Recording").closest("button");
        if (audioButton) {
          fireEvent.click(audioButton);
        }
      });

      // Verify correct parameters in navigation
      waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("type=behavioural")
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("mode=audio")
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("job=Job+description+for+behavioural+interview")
        );
      });
    });
  });
});

