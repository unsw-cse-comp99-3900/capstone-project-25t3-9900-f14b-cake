'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { InterviewRecord } from '@/app/bank/history/type';
import { getUserDetail } from '@/features/user/services';
import { transformInterviewsToRecords } from '@/utils/dataTransform';

export default function HomePage() {
  const router = useRouter();
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load interview records from API
  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        const userData = await getUserDetail();
        console.log('User data from API:', userData);
        console.log('Interviews count:', userData.interviews?.length || 0);
        const transformedRecords = transformInterviewsToRecords(userData.interviews || []);
        console.log('Transformed records:', transformedRecords);
        setRecords(transformedRecords);
      } catch (e) {
        console.error('Failed to load interview history from API', e);
        // Fallback to localStorage if API fails
        const stored = localStorage.getItem('interview_history');
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setRecords(data);
          } catch (parseError) {
            console.error('Failed to parse interview history from localStorage', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadRecords();
  }, []);

  // Prepare chart data from records - count interviews per day
  const chartData = useMemo(() => {
    const days = 7;
    interface ChartDataPoint {
      date: string;
      dateKey: string;
      count: number;
    }
    const dataMap = new Map<string, ChartDataPoint>();
    
    // Calculate the start date (7 days ago from today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (days - 1)); // Include today, so go back 6 days
    
    // Initialize all 7 days with 0
    const chartDataArray: ChartDataPoint[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dataPoint: ChartDataPoint = { date: dayLabel, dateKey, count: 0 };
      dataMap.set(dateKey, dataPoint);
      chartDataArray.push(dataPoint);
    }

    if (records && records.length > 0) {
      console.log('Processing records for chart:', records.length);
      // Count interviews per day (only for dates in our 7-day range)
      // Use timestamp from backend (Unix timestamp in seconds) if available
      records.forEach((record) => {
        // Use timestamp if available
        // Backend returns timestamp in milliseconds (from current_millis()), but user said it's in seconds
        // Handle both cases: if timestamp < 1e12, treat as seconds, otherwise as milliseconds
        let timestamp: number;
        if (record.timestamp) {
          // If timestamp is less than 1e12 (year 2001 in seconds), it's likely in seconds
          // Otherwise, it's in milliseconds
          timestamp = record.timestamp < 1e12 ? record.timestamp * 1000 : record.timestamp;
        } else {
          timestamp = new Date(record.createdAt).getTime();
        }
        
        const recordDate = new Date(timestamp);
        recordDate.setHours(0, 0, 0, 0); // Reset to start of day
        const dateKey = recordDate.toISOString().split('T')[0];
        
        console.log(`Record date: ${dateKey}, timestamp: ${record.timestamp}, converted: ${timestamp}, createdAt: ${record.createdAt}`);
        
        if (dataMap.has(dateKey)) {
          const existing = dataMap.get(dateKey)!;
          existing.count += 1;
          console.log(`Matched date ${dateKey}, count now: ${existing.count}`);
        } else {
          console.log(`Date ${dateKey} not in 7-day range. Available dates:`, Array.from(dataMap.keys()));
        }
      });
    } else {
      // Generate mock data for demonstration
      chartDataArray.forEach((entry) => {
        entry.count = Math.floor(Math.random() * 3) + 1;
      });
    }

    // Return the array (already sorted chronologically)
    return chartDataArray;
  }, [records]);

  // Calculate total interviews in the last 7 days (from chart data)
  const recentWeekTotal = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }
    // Sum up all counts from the chart data
    return chartData.reduce((sum, dataPoint) => sum + dataPoint.count, 0);
  }, [chartData]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome User!</h1>
                <p className="text-gray-600">Ready to land your next role as a Software Engineer? <span className="text-blue-600 cursor-pointer hover:underline">edit</span></p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Saved', count: 0, icon: 'bookmark', color: 'green' },
              { label: 'Applied', count: 0, icon: 'send', color: 'blue' },
              { label: 'Interview', count: 0, icon: 'headset_mic', color: 'purple' },
              { label: 'Offers', count: 0, icon: 'emoji_events', color: 'yellow' },
            ].map(({ label, count, icon, color }) => (
              <div key={label} className="modern-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    color === 'green' ? 'bg-green-100' :
                    color === 'blue' ? 'bg-blue-100' :
                    color === 'purple' ? 'bg-purple-100' :
                    'bg-yellow-100'
                  }`}>
                    <span className={`material-symbols-outlined text-${
                      color === 'green' ? 'green' :
                      color === 'blue' ? 'blue' :
                      color === 'purple' ? 'purple' :
                      'yellow'
                    }-600`} style={{ fontSize: 24 }}>{icon}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>

          {/* Main Action Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="modern-card p-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Your Interview Practice</h2>
                <p className="text-gray-600 mb-8">Practice with AI, get instant feedback, and track your progress over time.</p>
                <button
                  onClick={() => router.push('/interview')}
                  className="btn-primary w-full py-4"
                >
                  Start an interview
                </button>
              </div>
            </div>

            <div className="modern-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent interviews</h3>
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{recentWeekTotal} total</span>
              </div>
              <div className="h-64">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Loading...
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={chartData} 
                      margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#e5e7eb" 
                        vertical={false}
                        opacity={0.5}
                      />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        style={{ fontSize: '11px', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis 
                        domain={[0, 'dataMax + 1']}
                        stroke="#6b7280"
                        style={{ fontSize: '11px', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        label={{ 
                          value: 'Interview Count', 
                          angle: -90, 
                          position: 'insideLeft', 
                          style: { fontSize: '12px', fill: '#6b7280', fontWeight: 500 } 
                        }}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          padding: '8px 12px'
                        }}
                        labelStyle={{ 
                          fontWeight: 600, 
                          color: '#374151',
                          marginBottom: '4px'
                        }}
                        formatter={(value: number) => [`${value}`, 'Interview Count']}
                        separator=": "
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#colorGradient)"
                        dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#2563eb' }}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No interview data available
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
