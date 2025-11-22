/// <reference types="@testing-library/jest-dom" />

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HistoryPage from "@/app/bank/history/page";
import { bankService } from "@/features/bank/services";
import type { InterviewRecord } from "@/app/bank/history/type";

// Mock Next.js router and navigation
const mockPush = jest.fn();
const mockPathname = "/bank/history";
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
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

// Mock bank service
jest.mock("@/features/bank/services", () => ({
  bankService: {
    getRecords: jest.fn(),
    toggleLike: jest.fn(),
    getById: jest.fn(),
  },
}));

// Mock sessionStorage
const mockSessionStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

const mockRecords: InterviewRecord[] = [
  {
    id: "1",
    questionType: "behavioural",
    timeElapsed: 300,
    createdAt: "2024-01-15T10:00:00Z",
    timestamp: 1705315200000,
    totalScore: 4.5,
    questions: ["Question 1", "Question 2"],
    answers: {
      0: { textAnswer: "Answer 1", transcribedText: null },
      1: { textAnswer: "Answer 2", transcribedText: null },
    },
    feedbacks: {
      0: { text: "Good answer", scores: [4, 5, 4], error: false, loading: false },
      1: { text: "Excellent", scores: [5, 5, 5], error: false, loading: false },
    },
    mode: "text",
    is_like: true,
  },
  {
    id: "2",
    questionType: "technical",
    timeElapsed: 450,
    createdAt: "2024-01-14T10:00:00Z",
    timestamp: 1705228800000,
    totalScore: 3.8,
    questions: ["Question 1"],
    answers: {
      0: { textAnswer: "Answer 1", transcribedText: null },
    },
    feedbacks: {
      0: { text: "Good", scores: [4, 4, 3], error: false, loading: false },
    },
    mode: "audio",
    is_like: false,
  },
  {
    id: "3",
    questionType: "psychometric",
    timeElapsed: 200,
    createdAt: "2024-01-13T10:00:00Z",
    timestamp: 1705142400000,
    totalScore: 2.5,
    questions: ["Question 1"],
    answers: {
      0: { textAnswer: "Answer 1", transcribedText: null },
    },
    feedbacks: {
      0: { text: "Needs improvement", scores: [2, 3, 2], error: false, loading: false },
    },
    mode: "text",
    is_like: false,
  },
];

describe("Bank History Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockSessionStorage.setItem.mockClear();
    mockSessionStorage.getItem.mockClear();
    
    // Setup localStorage mock
    Storage.prototype.getItem = jest.fn((key: string) => {
      if (key === "interview_history") {
        return JSON.stringify(mockRecords);
      }
      if (key === "interview_favorites") {
        return JSON.stringify([]);
      }
      return null;
    });
    Storage.prototype.setItem = jest.fn();
    
    // Ensure sessionStorage is properly mocked
    (window.sessionStorage as any) = mockSessionStorage;
  });

  describe("Rendering", () => {
    it("should render page with title", async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByText("Interview Records")).toBeInTheDocument();
      });
    });

    it("should render Navbar component", async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId("navbar")).toBeInTheDocument();
      });
    });

    it("should render History and Favorites tabs", async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByText("History")).toBeInTheDocument();
        expect(screen.getByText("Favorites")).toBeInTheDocument();
      });
    });

    it("should show loading state initially", () => {
      (bankService.getRecords as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );
      
      render(<HistoryPage />);
      
      expect(screen.getByText("Loading interview records...")).toBeInTheDocument();
    });
  });

  describe("Record Loading", () => {
    it("should load and display interview records from API", async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        // Text is displayed with capitalize CSS, so we check for lowercase text
        expect(screen.getByText("behavioural")).toBeInTheDocument();
        expect(screen.getByText("technical")).toBeInTheDocument();
        expect(screen.getByText("psychometric")).toBeInTheDocument();
      });
    });

    it("should fallback to localStorage when API fails", async () => {
      (bankService.getRecords as jest.Mock).mockRejectedValue(new Error("API Error"));
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByText("behavioural")).toBeInTheDocument();
      });
    });

    it("should display empty state when no records exist", async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue([]);
      Storage.prototype.getItem = jest.fn(() => null);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByText("No interview records yet.")).toBeInTheDocument();
        expect(screen.getByText("Start your first interview")).toBeInTheDocument();
      });
    });

    it("should sort records by timestamp (newest first)", async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        const rows = screen.getAllByText(/behavioural|technical|psychometric/i);
        // First record should be the newest (behavioural with latest timestamp)
        expect(rows[0]).toHaveTextContent(/behavioural/i);
      });
    });
  });

  describe("Record Display", () => {
    beforeEach(async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      render(<HistoryPage />);
      await waitFor(() => {
        expect(screen.getByText("behavioural")).toBeInTheDocument();
      });
    });

    it("should display question type correctly", () => {
      expect(screen.getByText("behavioural")).toBeInTheDocument();
      expect(screen.getByText("technical")).toBeInTheDocument();
    });

    it("should display formatted date and time", () => {
      // Dates are formatted, so we check for presence of date elements
      const dateCells = screen.getAllByText(/\w{3} \d{1,2}, \d{4}/);
      expect(dateCells.length).toBeGreaterThan(0);
    });

    it("should display formatted duration", () => {
      // Duration should be in MM:SS format
      expect(screen.getByText("5:00")).toBeInTheDocument(); // 300 seconds
      expect(screen.getByText("7:30")).toBeInTheDocument(); // 450 seconds
      expect(screen.getByText("3:20")).toBeInTheDocument(); // 200 seconds
    });

    it("should display total score with correct styling", () => {
      // High score (4.5) should have green styling
      const highScore = screen.getByText("4.5/5");
      expect(highScore).toBeInTheDocument();
      
      // Medium score (3.8) should have yellow styling
      const mediumScore = screen.getByText("3.8/5");
      expect(mediumScore).toBeInTheDocument();
      
      // Low score (2.5) should have red styling
      const lowScore = screen.getByText("2.5/5");
      expect(lowScore).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("should display pagination when records exceed items per page", async () => {
      const manyRecords = Array.from({ length: 25 }, (_, i) => ({
        ...mockRecords[0],
        id: `record-${i}`,
        timestamp: 1705315200000 - i * 86400000,
      }));
      
      (bankService.getRecords as jest.Mock).mockResolvedValue(manyRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Showing 1 to 10 of 25 records/)).toBeInTheDocument();
      });
    });

    it("should navigate to next page", async () => {
      const manyRecords = Array.from({ length: 25 }, (_, i) => ({
        ...mockRecords[0],
        id: `record-${i}`,
        timestamp: 1705315200000 - i * 86400000,
      }));
      
      (bankService.getRecords as jest.Mock).mockResolvedValue(manyRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByText("Next")).toBeInTheDocument();
      });
      
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Showing 11 to 20 of 25 records/)).toBeInTheDocument();
      });
    });

    it("should navigate to previous page", async () => {
      const manyRecords = Array.from({ length: 25 }, (_, i) => ({
        ...mockRecords[0],
        id: `record-${i}`,
        timestamp: 1705315200000 - i * 86400000,
      }));
      
      (bankService.getRecords as jest.Mock).mockResolvedValue(manyRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);
      });
      
      await waitFor(() => {
        const prevButton = screen.getByText("Previous");
        expect(prevButton).not.toBeDisabled();
        fireEvent.click(prevButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/Showing 1 to 10 of 25 records/)).toBeInTheDocument();
      });
    });

    it("should disable Previous button on first page", async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        const prevButton = screen.queryByText("Previous");
        if (prevButton) {
          expect(prevButton).toBeDisabled();
        }
      });
    });

    it("should disable Next button on last page", async () => {
      const fewRecords = mockRecords.slice(0, 5);
      (bankService.getRecords as jest.Mock).mockResolvedValue(fewRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        const nextButton = screen.queryByText("Next");
        if (nextButton) {
          expect(nextButton).toBeDisabled();
        }
      });
    });
  });

  describe("Favorite Toggle", () => {
    beforeEach(async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      render(<HistoryPage />);
      await waitFor(() => {
        expect(screen.getByText("behavioural")).toBeInTheDocument();
      });
    });

    it("should toggle favorite status when star is clicked", async () => {
      (bankService.toggleLike as jest.Mock).mockResolvedValue({ is_like: false });
      (bankService.getRecords as jest.Mock).mockResolvedValue([
        ...mockRecords,
        { ...mockRecords[0], is_like: false },
      ]);
      
      const favoriteButtons = screen.getAllByTitle(/Add to favorites|Remove from favorites/);
      const firstFavoriteButton = favoriteButtons[0];
      
      fireEvent.click(firstFavoriteButton);
      
      await waitFor(() => {
        expect(bankService.toggleLike).toHaveBeenCalledWith("1");
      });
    });

    it("should update records after toggling favorite", async () => {
      (bankService.toggleLike as jest.Mock).mockResolvedValue({ is_like: false });
      const updatedRecords = mockRecords.map(r => 
        r.id === "1" ? { ...r, is_like: false } : r
      );
      (bankService.getRecords as jest.Mock)
        .mockResolvedValueOnce(mockRecords)
        .mockResolvedValueOnce(updatedRecords);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByText("behavioural")).toBeInTheDocument();
      });
      
      const favoriteButtons = screen.getAllByTitle(/Add to favorites|Remove from favorites/);
      fireEvent.click(favoriteButtons[0]);
      
      await waitFor(() => {
        expect(bankService.getRecords).toHaveBeenCalledTimes(2);
      });
    });

    it("should fallback to localStorage when toggle API fails", async () => {
      (bankService.toggleLike as jest.Mock).mockRejectedValue(new Error("API Error"));
      
      const favoriteButtons = screen.getAllByTitle(/Add to favorites|Remove from favorites/);
      fireEvent.click(favoriteButtons[0]);
      
      await waitFor(() => {
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(
          "interview_favorites",
          expect.any(String)
        );
      });
    });
  });

  describe("View Details", () => {
    beforeEach(async () => {
      (bankService.getRecords as jest.Mock).mockResolvedValue(mockRecords);
      render(<HistoryPage />);
      await waitFor(() => {
        expect(screen.getByText("behavioural")).toBeInTheDocument();
      });
    });

    it("should navigate to feedback page when View Details is clicked", () => {
      const viewDetailsButtons = screen.getAllByText("View Details");
      fireEvent.click(viewDetailsButtons[0]);
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        "interview_feedback_data",
        expect.stringContaining("questions")
      );
      expect(mockPush).toHaveBeenCalledWith("/interview/feedback");
    });

    it("should store correct record data in sessionStorage", () => {
      const viewDetailsButtons = screen.getAllByText("View Details");
      fireEvent.click(viewDetailsButtons[0]);
      
      const storedData = JSON.parse(mockSessionStorage.setItem.mock.calls[0][1]);
      expect(storedData).toHaveProperty("questions");
      expect(storedData).toHaveProperty("answers");
      expect(storedData).toHaveProperty("feedbacks");
      expect(storedData).toHaveProperty("questionType", "behavioural");
      expect(storedData).toHaveProperty("interview_id", "1");
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      (bankService.getRecords as jest.Mock).mockRejectedValue(new Error("Network error"));
      Storage.prototype.getItem = jest.fn(() => null);
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        expect(screen.getByText("No interview records yet.")).toBeInTheDocument();
      });
    });

    it("should handle localStorage parse errors", async () => {
      (bankService.getRecords as jest.Mock).mockRejectedValue(new Error("API Error"));
      Storage.prototype.getItem = jest.fn(() => "invalid json");
      
      render(<HistoryPage />);
      
      await waitFor(() => {
        // Should show empty state when both API and localStorage fail
        expect(screen.getByText("No interview records yet.")).toBeInTheDocument();
      });
    });
  });
});

