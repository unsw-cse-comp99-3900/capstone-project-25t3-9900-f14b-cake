/**
 * Interview Page Tests
 * Tests cover: form inputs, validation, modal interactions, and navigation
 */

/// <reference types="@testing-library/jest-dom" />

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InterviewPage from "../page";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Navbar component
jest.mock("@/components/Navbar", () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

describe("Interview Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  describe("Rendering", () => {
    it("should render interview setup page with title", () => {
      render(<InterviewPage />);
      
      expect(screen.getByText("AI Interview Setup")).toBeInTheDocument();
      expect(screen.getByText("Configure your personalized mock interview")).toBeInTheDocument();
    });

    it("should render question type selector", () => {
      render(<InterviewPage />);
      
      expect(screen.getByLabelText("Please select question type")).toBeInTheDocument();
    });

    it("should render job description textarea", () => {
      render(<InterviewPage />);
      
      const textarea = screen.getByPlaceholderText("Paste the job description here to get more targeted questions...");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("required");
    });

    it("should render Start Interview button", () => {
      render(<InterviewPage />);
      
      expect(screen.getByText("Start Interview")).toBeInTheDocument();
    });

    it("should render Navbar component", () => {
      render(<InterviewPage />);
      
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should disable Start Interview button when question type is not selected", () => {
      render(<InterviewPage />);
      
      const startButton = screen.getByText("Start Interview");
      expect(startButton).toBeDisabled();
    });

    it("should disable Start Interview button when job description is empty", () => {
      render(<InterviewPage />);
      
      // Select question type but leave job description empty
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      const behaviouralOption = screen.getByText("Behavioural");
      fireEvent.click(behaviouralOption);
      
      const startButton = screen.getByText("Start Interview");
      expect(startButton).toBeDisabled();
    });

    it("should disable Start Interview button when job description is only whitespace", () => {
      render(<InterviewPage />);
      
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      const behaviouralOption = screen.getByText("Behavioural");
      fireEvent.click(behaviouralOption);
      
      const jobDescription = screen.getByPlaceholderText("Paste the job description here to get more targeted questions...");
      fireEvent.change(jobDescription, { target: { value: "   " } });
      
      const startButton = screen.getByText("Start Interview");
      expect(startButton).toBeDisabled();
    });

    it("should enable Start Interview button when both fields are filled", () => {
      render(<InterviewPage />);
      
      // Select question type
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      const behaviouralOption = screen.getByText("Behavioural");
      fireEvent.click(behaviouralOption);
      
      // Enter job description
      const jobDescription = screen.getByPlaceholderText("Paste the job description here to get more targeted questions...");
      fireEvent.change(jobDescription, { target: { value: "Software Engineer position" } });
      
      const startButton = screen.getByText("Start Interview");
      expect(startButton).not.toBeDisabled();
    });
  });

  describe("Question Type Selection", () => {
    it("should allow selecting Behavioural question type", () => {
      render(<InterviewPage />);
      
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      const behaviouralOption = screen.getByText("Behavioural");
      fireEvent.click(behaviouralOption);
      
      expect(questionTypeSelect).toHaveTextContent("Behavioural");
    });

    it("should allow selecting Technical question type", () => {
      render(<InterviewPage />);
      
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      const technicalOption = screen.getByText("Technical");
      fireEvent.click(technicalOption);
      
      expect(questionTypeSelect).toHaveTextContent("Technical");
    });

    it("should allow selecting Psychometric question type", () => {
      render(<InterviewPage />);
      
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      const psychometricOption = screen.getByText("Psychometric");
      fireEvent.click(psychometricOption);
      
      expect(questionTypeSelect).toHaveTextContent("Psychometric");
    });
  });

  describe("Job Description Input", () => {
    it("should update job description when user types", async () => {
      render(<InterviewPage />);
      
      const jobDescription = screen.getByPlaceholderText("Paste the job description here to get more targeted questions...");
      await userEvent.type(jobDescription, "Looking for a software engineer");
      
      expect(jobDescription).toHaveValue("Looking for a software engineer");
    });

    it("should allow multiline job description", async () => {
      render(<InterviewPage />);
      
      const jobDescription = screen.getByPlaceholderText("Paste the job description here to get more targeted questions...");
      await userEvent.type(jobDescription, "Line 1\nLine 2\nLine 3");
      
      expect(jobDescription).toHaveValue("Line 1\nLine 2\nLine 3");
    });
  });

  describe("Modal Interactions", () => {
    beforeEach(() => {
      // Setup form with valid data
      render(<InterviewPage />);
      
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      fireEvent.click(screen.getByText("Behavioural"));
      
      const jobDescription = screen.getByPlaceholderText("Paste the job description here to get more targeted questions...");
      fireEvent.change(jobDescription, { target: { value: "Software Engineer position" } });
    });

    it("should open modal when Start Interview button is clicked", () => {
      const startButton = screen.getByText("Start Interview");
      fireEvent.click(startButton);
      
      expect(screen.getByText("Choose Answer Mode")).toBeInTheDocument();
      expect(screen.getByText("How would you like to answer the interview questions?")).toBeInTheDocument();
    });

    it("should show Audio Recording and Text Input options in modal", () => {
      const startButton = screen.getByText("Start Interview");
      fireEvent.click(startButton);
      
      expect(screen.getByText("Audio Recording")).toBeInTheDocument();
      expect(screen.getByText("Speak your answers naturally")).toBeInTheDocument();
      expect(screen.getByText("Text Input")).toBeInTheDocument();
      expect(screen.getByText("Type your answers")).toBeInTheDocument();
    });

    it("should close modal when close button is clicked", () => {
      const startButton = screen.getByText("Start Interview");
      fireEvent.click(startButton);
      
      expect(screen.getByText("Choose Answer Mode")).toBeInTheDocument();
      
      const closeButton = screen.getByText("close").closest("button");
      if (closeButton) {
        fireEvent.click(closeButton);
      }
      
      expect(screen.queryByText("Choose Answer Mode")).not.toBeInTheDocument();
    });

    it("should navigate to answering page with audio mode when Audio Recording is selected", () => {
      const startButton = screen.getByText("Start Interview");
      fireEvent.click(startButton);
      
      const audioButton = screen.getByText("Audio Recording").closest("button");
      if (audioButton) {
        fireEvent.click(audioButton);
      }
      
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/interview/answering?")
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("mode=audio")
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("type=behavioural")
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("job=Software+Engineer+position")
      );
    });

    it("should navigate to answering page with text mode when Text Input is selected", () => {
      const startButton = screen.getByText("Start Interview");
      fireEvent.click(startButton);
      
      const textButton = screen.getByText("Text Input").closest("button");
      if (textButton) {
        fireEvent.click(textButton);
      }
      
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("/interview/answering?")
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("mode=text")
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("type=behavioural")
      );
    });

    it("should trim job description when navigating", () => {
      const jobDescription = screen.getByPlaceholderText("Paste the job description here to get more targeted questions...");
      fireEvent.change(jobDescription, { target: { value: "  Software Engineer  " } });
      
      const startButton = screen.getByText("Start Interview");
      fireEvent.click(startButton);
      
      const audioButton = screen.getByText("Audio Recording").closest("button");
      if (audioButton) {
        fireEvent.click(audioButton);
      }
      
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("job=Software+Engineer")
      );
      expect(mockPush).not.toHaveBeenCalledWith(
        expect.stringContaining("job=++Software+Engineer++")
      );
    });
  });

  describe("Navigation", () => {
    it("should include correct query parameters for different question types", () => {
      render(<InterviewPage />);
      
      // Test Technical type
      const questionTypeSelect = screen.getByLabelText("Please select question type");
      fireEvent.mouseDown(questionTypeSelect);
      fireEvent.click(screen.getByText("Technical"));
      
      const jobDescription = screen.getByPlaceholderText("Paste the job description here to get more targeted questions...");
      fireEvent.change(jobDescription, { target: { value: "Tech job" } });
      
      const startButton = screen.getByText("Start Interview");
      fireEvent.click(startButton);
      
      const audioButton = screen.getByText("Audio Recording").closest("button");
      if (audioButton) {
        fireEvent.click(audioButton);
      }
      
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("type=technical")
      );
    });
  });
});

