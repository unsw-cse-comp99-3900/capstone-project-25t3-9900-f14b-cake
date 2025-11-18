'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { InterviewRecord } from './type';
import { bankService } from '@/features/bank/services';

const ITEMS_PER_PAGE = 10;

function FavoritesContent() {
  const router = useRouter();
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<InterviewRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show records that is_like is true
    const loadRecords = async () => {
      try {
        setLoading(true);
        const favoriteRecords = await bankService.getFavorites();
        // Sort by timestamp (newest first)
        const sortedRecords = favoriteRecords.sort((a, b) => {
          const getTimestamp = (record: InterviewRecord): number => {
            if (record.timestamp) {
              return record.timestamp < 1e12 ? record.timestamp * 1000 : record.timestamp;
            }
            return new Date(record.createdAt).getTime();
          };
          return getTimestamp(b) - getTimestamp(a);
        });
        setRecords(sortedRecords);
      } catch (e) {
        console.error('Failed to load interview favorites from API', e);
        const stored = localStorage.getItem('interview_favorites');
        if (stored) {
          try {
            const data = JSON.parse(stored);
            // Sort by timestamp (newest first)
            const sortedData = data.sort((a: InterviewRecord, b: InterviewRecord) => {
              const getTimestamp = (record: InterviewRecord): number => {
                if (record.timestamp) {
                  return record.timestamp < 1e12 ? record.timestamp * 1000 : record.timestamp;
                }
                return new Date(record.createdAt).getTime();
              };
              return getTimestamp(b) - getTimestamp(a);
            });
            setRecords(sortedData);
          } catch (parseError) {
            console.error('Failed to parse interview favorites from localStorage', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  const calculateTotalScore = (feedbacks: Record<number, { scores: number[] | null }>): number => {
    const allScores = Object.values(feedbacks).flatMap(f => f.scores || []);
    if (allScores.length === 0) return 0;
    return Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10;
  };

  const formatDate = (record: InterviewRecord): string => {
    // Trans timestamp to date
    let timestamp: number;
    const recordTimestamp = record.timestamp;
    if (recordTimestamp !== undefined && recordTimestamp !== null) {
      timestamp = recordTimestamp < 1e12 ? recordTimestamp * 1000 : recordTimestamp;
    } else {
      timestamp = new Date(record.createdAt).getTime();
    }
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const viewDetails = (record: InterviewRecord) => {
    sessionStorage.setItem('interview_feedback_data', JSON.stringify({
      questions: record.questions,
      answers: record.answers,
      feedbacks: record.feedbacks,
      questionType: record.questionType,
      mode: record.mode,
      timeElapsed: record.timeElapsed,
      interview_id: record.id, 
    }));
    router.push('/interview/feedback');
  };

  const removeFavorite = async (recordId: string) => {
    try {
      await bankService.toggleLike(recordId);
      const favoriteRecords = await bankService.getFavorites();
      // Sort by timestamp (newest first)
      const sortedRecords = favoriteRecords.sort((a, b) => {
        const getTimestamp = (record: InterviewRecord): number => {
          if (record.timestamp) {
            return record.timestamp < 1e12 ? record.timestamp * 1000 : record.timestamp;
          }
          return new Date(record.createdAt).getTime();
        };
        return getTimestamp(b) - getTimestamp(a);
      });
      setRecords(sortedRecords);
    } catch (e) {
      console.error('Failed to toggle favorite', e);
      const favorites = JSON.parse(localStorage.getItem('interview_favorites') || '[]');
      const updated = favorites.filter((f: InterviewRecord) => f.id !== recordId);
      localStorage.setItem('interview_favorites', JSON.stringify(updated));
      setRecords(updated);
    }
  };

  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = records.slice(startIndex, endIndex);

  const pathname = usePathname();
  const isHistory = pathname === '/bank/history';
  const isFavorites = pathname === '/bank/favorites';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 p-5 pt-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Interview Records</h2>
          
          {/* Tab Navigation Bar */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-lg p-1 shadow-lg border border-blue-100 min-w-[360px]">
              <Link
                href="/bank/history"
                className={`px-16 py-3 rounded-md text-sm font-semibold transition-all duration-200 ${
                  isHistory
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                History
              </Link>
              <Link
                href="/bank/favorites"
                className={`px-16 py-3 rounded-md text-sm font-semibold transition-all duration-200 ${
                  isFavorites
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Favorites
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Loading favorite records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No favorite records yet.</p>
              <Link href="/bank/history" className="text-blue-600 hover:underline mt-4 inline-block">
                Browse history to add favorites
              </Link>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-lg">
                <table className="w-full">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Question Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Score</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-blue-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize">{record.questionType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(record)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatTime(record.timeElapsed)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            record.totalScore >= 4 ? 'bg-green-100 text-green-800' :
                            record.totalScore >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.totalScore}/5
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 mr-19">
                            <button
                              onClick={() => viewDetails(record)}
                              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => removeFavorite(record.id)}
                              className="p-2 text-yellow-500 hover:text-red-500 transition-colors"
                              title="Remove from favorites"
                            >
                              <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, records.length)} of {records.length} records
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 p-5 pt-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    }>
      <FavoritesContent />
    </Suspense>
  );
}

