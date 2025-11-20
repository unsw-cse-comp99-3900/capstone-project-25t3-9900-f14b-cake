/**
 * Game Page Tests
 * Tests cover: component behaviour, user interactions, and rendering logic
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GamePage from "../page";
import { getGamePageData } from "@/services";

// Mock the services
jest.mock("@/services", () => ({
    getGamePageData: jest.fn(),
}));

const mockGameData = {
    badges: [
        {
            badgeId: 1,
            name: "First Steps",
            description: "Start your interview preparation journey",
            unlockedTimestamp: 1698796800,
            unlockedDate: new Date("2023-11-01"),
            isUnlocked: true,
        },
        {
            badgeId: 2,
            name: "XP Novice",
            description: "Accumulate 100 experience points",
            unlockedTimestamp: 1698883200,
            unlockedDate: new Date("2023-11-02"),
            isUnlocked: true,
        },
        {
            badgeId: 3,
            name: "XP Expert",
            description: "Accumulate 500 experience points",
            unlockedTimestamp: 0,
            unlockedDate: new Date(0),
            isUnlocked: false,
        },
        {
            badgeId: 4,
            name: "XP Master",
            description: "Accumulate 1000 experience points",
            unlockedTimestamp: 0,
            unlockedDate: new Date(0),
            isUnlocked: false,
        },
    ],
    totalBadges: 4,
    unlockedBadges: 2,
    xpData: {
        currentXP: 250,
        currentLevel: 1,
        xpToNextLevel: 150,
        levelProgress: 62.5,
    },
    userId: "test-user",
    userEmail: "test@example.com",
};

describe("Game Page", () => {
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
            (getGamePageData as jest.Mock).mockImplementation(
                () => new Promise(() => {}) // Never resolves
            );

            render(<GamePage />);

            expect(
                screen.getByText("Loading game data...")
            ).toBeInTheDocument();
        });

        it("should display error state when API fails", async () => {
            // Mock API to reject
            (getGamePageData as jest.Mock).mockRejectedValue(
                new Error("Failed to load game data")
            );

            render(<GamePage />);

            await waitFor(() => {
                expect(
                    screen.getByText(/Failed to load game data/i)
                ).toBeInTheDocument();
            });
        });

        it("should display error when user is not logged in", async () => {
            // Mock no auth token
            Storage.prototype.getItem = jest.fn(() => null);

            render(<GamePage />);

            await waitFor(() => {
                expect(
                    screen.getByText("Please login first")
                ).toBeInTheDocument();
            });
        });

        it("should render complete page when data loads successfully", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            // Wait for loading to complete
            await waitFor(() => {
                expect(
                    screen.queryByText("Loading game data...")
                ).not.toBeInTheDocument();
            });

            // Check main sections are rendered
            expect(screen.getByText("Gamification System")).toBeInTheDocument();
            expect(screen.getByText("Daily Inspiration")).toBeInTheDocument();
            expect(screen.getByText("Achievement Badges")).toBeInTheDocument();
        });

        it("should display badge list correctly", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(screen.getByText("First Steps")).toBeInTheDocument();
                expect(screen.getByText("XP Novice")).toBeInTheDocument();
                expect(screen.getByText("XP Expert")).toBeInTheDocument();
                expect(screen.getByText("XP Master")).toBeInTheDocument();
            });
        });

        it("should distinguish between unlocked and locked badges", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                // Check for unlocked badge indicators
                const unlockedIndicators = screen.getAllByText("✓ Unlocked");
                expect(unlockedIndicators).toHaveLength(2); // 2 unlocked badges
            });
        });

        it("should display badge statistics correctly", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(screen.getByText(/2/)).toBeInTheDocument(); // Unlocked count
                expect(screen.getByText(/4/)).toBeInTheDocument(); // Total count
            });
        });

        it("should display daily quote", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(
                    screen.getByText("Daily Inspiration")
                ).toBeInTheDocument();
            });

            // Check that a quote is displayed (quotes are dynamic based on date)
            const quoteElements = screen.getAllByText(/"/);
            expect(quoteElements.length).toBeGreaterThan(0);
        });
    });

    describe("User Interactions", () => {
        it("should open badge details modal when badge is clicked", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(screen.getByText("First Steps")).toBeInTheDocument();
            });

            // Find the badge button and click it
            const badgeButtons = screen.getAllByRole("button");
            const firstStepsBadge = badgeButtons.find((button) =>
                button.textContent?.includes("First Steps")
            );

            if (firstStepsBadge) {
                fireEvent.click(firstStepsBadge);

                // Modal should appear with badge details
                await waitFor(() => {
                    // Badge name should appear in modal
                    const badgeNames = screen.getAllByText("First Steps");
                    expect(badgeNames.length).toBeGreaterThan(1); // One in list, one in modal
                });
            }
        });

        it("should close badge modal when Close button is clicked", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(screen.getByText("First Steps")).toBeInTheDocument();
            });

            // Click badge to open modal
            const badgeButtons = screen.getAllByRole("button");
            const firstStepsBadge = badgeButtons.find((button) =>
                button.textContent?.includes("First Steps")
            );

            if (firstStepsBadge) {
                fireEvent.click(firstStepsBadge);

                await waitFor(() => {
                    const closeButtons = screen.getAllByText("Close");
                    expect(closeButtons.length).toBeGreaterThan(0);
                });

                // Click Close button
                const closeButtons = screen.getAllByText("Close");
                if (closeButtons.length > 0) {
                    fireEvent.click(closeButtons[closeButtons.length - 1]);

                    // Modal should close (only one "First Steps" text remains)
                    await waitFor(() => {
                        const badgeNames = screen.getAllByText("First Steps");
                        expect(badgeNames.length).toBe(1);
                    });
                }
            }
        });

        it("should display correct badge status in modal", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(screen.getByText("First Steps")).toBeInTheDocument();
            });

            // Click unlocked badge
            const badgeButtons = screen.getAllByRole("button");
            const firstStepsBadge = badgeButtons.find((button) =>
                button.textContent?.includes("First Steps")
            );

            if (firstStepsBadge) {
                fireEvent.click(firstStepsBadge);

                await waitFor(() => {
                    // Should show unlocked status with date
                    expect(
                        screen.getByText(/✓ Unlocked on/)
                    ).toBeInTheDocument();
                });
            }
        });

        it("should show locked status for locked badges", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(screen.getByText("XP Expert")).toBeInTheDocument();
            });

            // Click locked badge
            const badgeButtons = screen.getAllByRole("button");
            const lockedBadge = badgeButtons.find((button) =>
                button.textContent?.includes("XP Expert")
            );

            if (lockedBadge) {
                fireEvent.click(lockedBadge);

                await waitFor(() => {
                    // Should show locked status
                    expect(screen.getByText(/🔒 Locked/)).toBeInTheDocument();
                });
            }
        });
    });

    describe("Component Behaviour", () => {
        it("should call API with correct token", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(getGamePageData).toHaveBeenCalledWith("mock-token");
            });
        });

        it("should correctly calculate unlocked badge count", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                // Check statistics show correct unlocked count
                expect(screen.getByText(/2/)).toBeInTheDocument();
            });
        });

        it("should handle empty badge data gracefully", async () => {
            const emptyGameData = {
                ...mockGameData,
                badges: [],
                totalBadges: 0,
                unlockedBadges: 0,
            };

            (getGamePageData as jest.Mock).mockResolvedValue(emptyGameData);

            render(<GamePage />);

            await waitFor(() => {
                expect(
                    screen.getByText("No badge data available")
                ).toBeInTheDocument();
            });
        });

        it("should apply correct styling to unlocked badges", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                const badgeButtons = screen.getAllByRole("button");
                const firstStepsBadge = badgeButtons.find((button) =>
                    button.textContent?.includes("First Steps")
                );

                // Unlocked badges should have specific styling
                expect(firstStepsBadge).toHaveClass("border-yellow-300");
            });
        });

        it("should apply correct styling to locked badges", async () => {
            (getGamePageData as jest.Mock).mockResolvedValue(mockGameData);

            render(<GamePage />);

            await waitFor(() => {
                const badgeButtons = screen.getAllByRole("button");
                const lockedBadge = badgeButtons.find((button) =>
                    button.textContent?.includes("XP Expert")
                );

                // Locked badges should have different styling
                expect(lockedBadge).toHaveClass("border-gray-200");
            });
        });
    });
});
