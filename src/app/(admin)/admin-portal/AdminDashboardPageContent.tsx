"use client";

import { useEffect, useState } from "react";
import {
  Bug,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Download,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { bugService } from "@/mocks/services";
import { appService } from "@/mocks/services";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const AdminDashboardPageContent = () => {
  const [stats, setStats] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appsData] = await Promise.all([
          bugService.getStats(),
          appService.getAllWithStats(),
        ]);
        setStats(statsData);
        setApps(appsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const trendData = [
    { week: "Week 1", bugs: 45 },
    { week: "Week 2", bugs: 78 },
    { week: "Week 3", bugs: 92 },
    { week: "Week 4", bugs: 115 },
  ];

  const severityData = stats
    ? [
        { name: "Critical", value: stats.bySeverity.critical, color: "#ef4444" },
        { name: "High", value: stats.bySeverity.high, color: "#f97316" },
        { name: "Medium", value: stats.bySeverity.medium, color: "#eab308" },
        { name: "Low", value: stats.bySeverity.low, color: "#22c55e" },
      ]
    : [];

  const recentActivity = [
    {
      user: "John Doe",
      action: "Reported bug",
      target: "Login page crash",
      date: "2 hours ago",
      status: "Open",
    },
    {
      user: "Jane Smith",
      action: "Resolved bug",
      target: "API timeout issue",
      date: "5 hours ago",
      status: "Resolved",
    },
    {
      user: "Mike Johnson",
      action: "Updated bug",
      target: "UI alignment problem",
      date: "1 day ago",
      status: "In Progress",
    },
  ];

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    bugService.getStats().then(statsData => {
      appService.getAllWithStats().then(appsData => {
        setStats(statsData);
        setApps(appsData);
        setLoading(false);
      });
    }).catch(() => {
      setError("Failed to load dashboard data");
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, Admin
          </h1>
          <p className="text-slate-400">
            Here&apos;s an overview of the system health and recent activities.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New App
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Reported Bugs
            </CardTitle>
            <Bug className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.total || 0}
            </div>
            <p className="text-xs text-green-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Active Users
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">84</div>
            <p className="text-xs text-green-500 mt-1">+2% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Managed Apps
            </CardTitle>
            <div className="h-5 w-5 text-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{apps.length}</div>
            <p className="text-xs text-slate-500 mt-1">No change</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Critical Issues
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.bySeverity.critical || 0}
            </div>
            <p className="text-xs text-red-500 mt-1">↑ 1 new</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bug Trend Chart */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Bug Reporting Trends
                </CardTitle>
                <p className="text-sm text-slate-400 mt-1">
                  Reports vs. Fixes (Last 30 Days)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-400"
                >
                  30 Days
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-400"
                >
                  7 Days
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorBugs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bugs"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorBugs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Breakdown */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Bug Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-400">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <Button variant="link" className="text-blue-500 hover:text-blue-400">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    USER
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    ACTION
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    TARGET
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    DATE & TIME
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {activity.user}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {activity.action}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {activity.target}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-400">
                      {activity.date}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.status === "Resolved"
                            ? "bg-green-900/50 text-green-400"
                            : activity.status === "Open"
                            ? "bg-blue-900/50 text-blue-400"
                            : "bg-yellow-900/50 text-yellow-400"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPageContent;
