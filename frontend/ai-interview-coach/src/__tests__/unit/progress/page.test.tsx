/**
 * Progress Page Tests
 * Tests cover: component behaviour, user interactions, and rendering logic
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProgressPage from "@/app/progress/page";
import { getProgressPageData, getUserTarget, setUserTarget } from "@/services";

// Mock the services
jest.mock("@/services", () => ({
    getProgressPageData: jest.fn(),
    getUserTarget: jest.fn(),
    setUserTarget: jest.fn(),
}));

// Mock Recharts components to avoid rendering issues in tests
jest.mock("recharts", () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    LineChart: ({ children }: any) => (
        <div data-testid="line-chart">{children}</div>
    ),
    Line: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
    RadarChart: ({ children }: any) => (
        <div data-testid="radar-chart">{children}</div>
    ),
    PolarGrid: () => <div />,
    PolarAngleAxis: () => <div />,
    PolarRadiusAxis: () => <div />,
    Radar: () => <div />,
}));

// Mock react-calendar
jest.mock("react-calendar", () => {
    return function Calendar() {
        return <div data-testid="calendar">Calendar Mock</div>;
    };
});

const mockProgressData = {
    readinessScores: [
        { session: 1, score: 65, date: new Date("2025-01-01") },
        { session: 2, score: 72, date: new Date("2025-01-02") },
        { session: 3, score: 78, date: new Date("2025-01-03") },
    ],
    loginData: [
        { date: "2025-01-01", hasLogin: true },
        { date: "2025-01-02", hasLogin: true },
        { date: "2025-01-03", hasLogin: false },
    ],
    loginStreakDays: 2,
    maxLoginStreak: 5,
    totalLoginDays: 10,
    dimensionPerformance: [
        {
            dimension: "CLARITY_STRUCTURE",
            dimension_name: "Clarity & Structure",
            average_score: 4.2,
            percentage: 84,
            is_strength: true,
        },
        {
            dimension: "RELEVANCE",
            dimension_name: "Relevance to Question/Job",
            average_score: 3.8,
            percentage: 76,
            is_strength: true,
        },
    ],
    latestInterviewQuestions: [],
    totalInterviews: 15,
};

describe("Progress Page", () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup localStorage mock
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === "auth_token") return "mock-token";
            return null;
        });
    });

    describe("Rendering Logic", () => {
        it("should display loading state initially", () => {
            // Mock API to delay response
            (getProgressPageData as jest.Mock).mockImplementation(
                () => new Promise(() => {}) // Never resolves
            );
            (getUserTarget as jest.Mock).mockImplementation(
                () => new Promise(() => {})
            );

            render(<ProgressPage />);

            expect(
                screen.getByText("Loading progress data...")
            ).toBeInTheDocument();
        });

        it("should display error state when API fails", async () => {
            // Mock API to reject
            (getProgressPageData as jest.Mock).mockRejectedValue(
                new Error("Failed to load data")
            );
            (getUserTarget as jest.Mock).mockRejectedValue(
                new Error("No target")
            );

            render(<ProgressPage />);

            await waitFor(() => {
                expect(
                    screen.getByText(/Failed to load data/i)
                ).toBeInTheDocument();
            });
        });

        it("should display error when user is not logged in", async () => {
            // Mock no auth token
            Storage.prototype.getItem = jest.fn(() => null);

            render(<ProgressPage />);

            await waitFor(() => {
                expect(
                    screen.getByText("Please login first")
                ).toBeInTheDocument();
            });
        });

        it("should render complete page when data loads successfully", async () => {
            // Mock successful API responses
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue({
                target_clarity: 4,
                target_relevance: 4,
                target_keyword: 4,
                target_confidence: 4,
                target_conciseness: 4,
            });

            render(<ProgressPage />);

            // Wait for loading to complete
            await waitFor(() => {
                expect(
                    screen.queryByText("Loading progress data...")
                ).not.toBeInTheDocument();
            });

            // Check main sections are rendered
            expect(
                screen.getByText("Progress Tracking System")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Interview Performance Progression")
            ).toBeInTheDocument();
            expect(screen.getByText("Login Activity")).toBeInTheDocument();
            expect(
                screen.getByText("Performance Dimensions Analysis")
            ).toBeInTheDocument();
        });

        it("should display readiness score statistics correctly", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);

            render(<ProgressPage />);

            await waitFor(() => {
                const scoreElements = screen.getAllByText("78");
                expect(scoreElements.length).toBeGreaterThan(0); // Last score appears at least once
            });
        });

        it("should display login streak information", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);

            render(<ProgressPage />);

            await waitFor(() => {
                // Check for streak information with "days" suffix
                expect(screen.getByText("2 days")).toBeInTheDocument(); // Current streak
                expect(screen.getByText("5 days")).toBeInTheDocument(); // Max streak
                expect(screen.getByText("10 days")).toBeInTheDocument(); // Total days
            });
        });
    });

    describe("User Interactions", () => {
        it("should switch to Last 7 Sessions view when clicked", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);

            render(<ProgressPage />);

            await waitFor(() => {
                expect(screen.getByText("Last 7 Sessions")).toBeInTheDocument();
            });

            const button = screen.getByText("Last 7 Sessions");
            fireEvent.click(button);

            // Button should have active state
            expect(button).toHaveClass("bg-blue-600");
        });

        it("should switch to Last 15 Sessions view when clicked", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);

            render(<ProgressPage />);

            await waitFor(() => {
                expect(
                    screen.getByText("Last 15 Sessions")
                ).toBeInTheDocument();
            });

            const button = screen.getByText("Last 15 Sessions");
            fireEvent.click(button);

            // Button should have active state
            expect(button).toHaveClass("bg-blue-600");
        });

        it("should open target score input when Set Target button clicked", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);

            render(<ProgressPage />);

            await waitFor(() => {
                expect(screen.getByText(/Set Target/i)).toBeInTheDocument();
            });

            const setTargetButton = screen.getByText(/Set Target/i);
            fireEvent.click(setTargetButton);

            // Save and Cancel buttons should appear
            await waitFor(() => {
                expect(screen.getByText("Save")).toBeInTheDocument();
                expect(screen.getByText("Cancel")).toBeInTheDocument();
            });
        });

        it("should save new target score successfully", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);
            (setUserTarget as jest.Mock).mockResolvedValue({ success: true });

            render(<ProgressPage />);

            await waitFor(() => {
                expect(screen.getByText(/Set Target/i)).toBeInTheDocument();
            });

            // Open target input
            const setTargetButton = screen.getByText(/Set Target/i);
            fireEvent.click(setTargetButton);

            // Wait for input controls to appear
            await waitFor(() => {
                expect(screen.getByText("Save")).toBeInTheDocument();
            });

            // Click increase button to change target score
            const increaseButton = screen.getByText("+");
            fireEvent.click(increaseButton);

            // Click Save
            const saveButton = screen.getByText("Save");
            fireEvent.click(saveButton);

            // Verify API was called
            await waitFor(() => {
                expect(setUserTarget).toHaveBeenCalledWith(
                    "mock-token",
                    expect.objectContaining({
                        target_clarity: expect.any(Number),
                        target_relevance: expect.any(Number),
                        target_keyword: expect.any(Number),
                        target_confidence: expect.any(Number),
                        target_conciseness: expect.any(Number),
                    })
                );
            });
        });

        it("should cancel target score editing when Cancel clicked", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);

            render(<ProgressPage />);

            await waitFor(() => {
                expect(screen.getByText(/Set Target/i)).toBeInTheDocument();
            });

            // Open target input
            const setTargetButton = screen.getByText(/Set Target/i);
            fireEvent.click(setTargetButton);

            await waitFor(() => {
                expect(screen.getByText("Save")).toBeInTheDocument();
            });

            // Click Cancel
            const cancelButton = screen.getByText("Cancel");
            fireEvent.click(cancelButton);

            // Input controls should disappear
            await waitFor(() => {
                expect(screen.queryByText("Save")).not.toBeInTheDocument();
            });
        });
    });

    describe("Component Behaviour", () => {
        it("should display charts when data is available", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);

            render(<ProgressPage />);

            await waitFor(() => {
                expect(screen.getByTestId("line-chart")).toBeInTheDocument();
                expect(screen.getByTestId("radar-chart")).toBeInTheDocument();
            });
        });

        it("should load target score from backend", async () => {
            const mockTarget = {
                target_clarity: 4,
                target_relevance: 4,
                target_keyword: 4,
                target_confidence: 4,
                target_conciseness: 4,
            };

            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(mockTarget);

            render(<ProgressPage />);

            await waitFor(() => {
                expect(getUserTarget).toHaveBeenCalledWith("mock-token");
            });
        });

        it("should call API with correct token", async () => {
            (getProgressPageData as jest.Mock).mockResolvedValue(
                mockProgressData
            );
            (getUserTarget as jest.Mock).mockResolvedValue(null);

            render(<ProgressPage />);

            await waitFor(() => {
                expect(getProgressPageData).toHaveBeenCalledWith("mock-token");
            });
        });
    });
});
