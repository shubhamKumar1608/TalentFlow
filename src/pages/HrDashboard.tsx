import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Import GrowthRateCard from the header file

// GrowthRateCard implementation moved from Header
const fetchMonthlyMetrics = async () => {
  const response = await fetch('/api/metrics/growth');
  return response.json();
};

const GrowthRateCard: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [previousMonth, setPreviousMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyMetrics().then((data) => {
      setCurrentMonth(data.currentMonth);
      setPreviousMonth(data.previousMonth);
      setLoading(false);
    });
  }, []);

  const growthRate =
    previousMonth === 0
      ? 0
      : ((currentMonth - previousMonth) / previousMonth) * 100;

  if (loading) return (
    <div className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
      <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-20"></div>
    </div>
  );

  // Determine color and icon for growth
  const isPositive = growthRate > 0;
  const isNegative = growthRate < 0;
  const color = isPositive ? 'text-blue-600 bg-blue-100' : isNegative ? 'text-red-600 bg-red-100' : 'text-slate-500 bg-slate-100';
  const icon = isPositive ? (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
    </svg>
  ) : isNegative ? (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12l-5 5L4 7" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
    </svg>
  );

  return (
    <div className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-3 ${color} rounded-xl shadow-sm`}>{icon}</div>
          <div className="ml-4">
            <h3 className="font-semibold text-slate-900 text-sm">Growth Rate</h3>
            <p className="text-xs text-slate-500"></p>
          </div>
        </div>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : isNegative ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
          {isPositive ? '+' : isNegative ? '-' : ''}{Math.abs(growthRate).toFixed(2)}%
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-2">{currentMonth}</div>
      <div className="flex items-center text-sm">
        <div className={`w-2 h-2 rounded-full mr-2 ${isPositive ? 'bg-blue-500' : isNegative ? 'bg-red-500' : 'bg-slate-500'}`}></div>
        <span className="text-slate-600">vs Last Month</span>
      </div>
    </div>
  );
};

interface DashboardStatistics {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  newCandidates: number;
  totalAssessments: number;
  completedAssessments: number;
  interviewsScheduled: number;
  offersPending: number;
  hiredCandidates: number;
}

const HrDashboard = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    newCandidates: 0,
    totalAssessments: 0,
    completedAssessments: 0,
    interviewsScheduled: 0,
    offersPending: 0,
    hiredCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("/dashboard/statistics");
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    iconColor,
    bgColor,
    trend,
    trendValue,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    iconColor: string;
    bgColor: string;
    trend?: string;
    trendValue?: string;
  }) => (
    <div className="group bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-3 ${bgColor} rounded-xl shadow-sm`}>
            <div className={`w-6 h-6 ${iconColor}`}>{icon}</div>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
            trendValue?.startsWith('+') 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-2">{value}</div>
      {trend && (
        <div className="flex items-center text-sm">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            trendValue?.startsWith('+') ? 'bg-blue-500' : 'bg-slate-500'
          }`}></div>
          <span className="text-slate-600">{trend}</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-slate-200 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-slate-200 rounded-xl w-12 h-12"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">HR Dashboard</h1>
              <p className="text-slate-600 text-lg">Welcome back! Here's what's happening with your recruitment.</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-500">Last updated</div>
                <div className="text-sm font-medium text-slate-900">Just now</div>
              </div>
              <button className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:bg-white transition-colors">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <GrowthRateCard />
          <StatCard
            title="Total Jobs"
            value={statistics.totalJobs}
            subtitle={`${statistics.activeJobs} active`}
            trend="vs last month"
            trendValue="+12%"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
            }
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
          />

          <StatCard
            title="Candidates"
            value={statistics.totalCandidates}
            subtitle={`${statistics.hiredCandidates} hired`}
            trend="vs last month"
            trendValue="+8%"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            }
            iconColor="text-green-600"
            bgColor="bg-green-100"
          />

          <StatCard
            title="Assessments"
            value={statistics.totalAssessments}
            subtitle={`${statistics.completedAssessments} completed`}
            trend="vs last month"
            trendValue="+15%"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            iconColor="text-purple-600"
            bgColor="bg-purple-100"
          />

          <StatCard
            title="Interviews"
            value={statistics.interviewsScheduled}
            subtitle={`${statistics.offersPending} offers pending`}
            trend="vs last month"
            trendValue="+5%"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            iconColor="text-orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => navigate("/dashboard/candidates")}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl shadow-sm group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                    Candidates
                  </h3>
                  <p className="text-sm text-slate-500">
                    Manage your candidate pipeline
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/dashboard/jobs")}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl shadow-sm group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Jobs
                  </h3>
                  <p className="text-sm text-slate-500">
                    Create and manage job postings
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/dashboard/assessments")}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl shadow-sm group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Assessments
                  </h3>
                  <p className="text-sm text-slate-500">
                    Create candidate assessments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <span className="text-sm text-slate-700 font-medium">
                  {statistics.newCandidates} new candidates applied this week
                </span>
                <div className="text-xs text-slate-500">This week</div>
              </div>
              <div className="text-xs text-slate-400">2h ago</div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <span className="text-sm text-slate-700 font-medium">
                  {statistics.completedAssessments} assessments completed
                </span>
                <div className="text-xs text-slate-500">This week</div>
              </div>
              <div className="text-xs text-slate-400">4h ago</div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <span className="text-sm text-slate-700 font-medium">
                  {statistics.activeJobs} active job postings
                </span>
                <div className="text-xs text-slate-500">Current</div>
              </div>
              <div className="text-xs text-slate-400">1d ago</div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <span className="text-sm text-slate-700 font-medium">
                  {statistics.interviewsScheduled} interviews scheduled
                </span>
                <div className="text-xs text-slate-500">Upcoming</div>
              </div>
              <div className="text-xs text-slate-400">2d ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
