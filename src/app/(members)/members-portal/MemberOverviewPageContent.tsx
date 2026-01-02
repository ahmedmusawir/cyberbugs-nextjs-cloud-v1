"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  Grid3x3,
  Bug,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appService, userService, bugService } from "@/mocks/services";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import Link from "next/link";

const MemberOverviewPageContent = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentBugs, setRecentBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsData, userData, statsData] = await Promise.all([
          appService.getAllWithStats(),
          userService.getCurrentUser(),
          bugService.getStats(),
        ]);
        setApps(appsData);
        setUser(userData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching overview data:", error);
        setError("Failed to load overview data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getHealthColor = (openBugs: number) => {
    if (openBugs === 0) return "bg-green-500";
    if (openBugs <= 5) return "bg-yellow-500";
    if (openBugs <= 10) return "bg-orange-500";
    return "bg-red-500";
  };

  const getHealthLabel = (openBugs: number) => {
    if (openBugs === 0) return "Excellent";
    if (openBugs <= 5) return "Good";
    if (openBugs <= 10) return "Fair";
    return "Poor";
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    Promise.all([
      appService.getAllWithStats(),
      userService.getCurrentUser(),
      bugService.getStats(),
    ])
      .then(([appsData, userData, statsData]) => {
        setApps(appsData);
        setUser(userData);
        setStats(statsData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load overview data");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading overview..." />
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
          <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
          <p className="text-slate-400">
            Welcome back, here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Grid3x3 className="h-4 w-4" />
            Manage Apps
          </Button>
          <Link href="/members-portal/report-bug">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Report Bug
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search applications, error codes, or bug IDs..."
            className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 h-12"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Applications
            </CardTitle>
            <Grid3x3 className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{apps.length}</div>
            <p className="text-xs text-green-500 mt-1">+2 New this month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Open Issues
            </CardTitle>
            <Bug className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.byStatus.open || 0}
            </div>
            <p className="text-xs text-red-500 mt-1">+5% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Critical Bugs
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.bySeverity.critical || 0}
            </div>
            <p className="text-xs text-red-500 mt-1">Needs immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Resolved (WTD)
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.byStatus.resolved || 0}
            </div>
            <p className="text-xs text-green-500 mt-1">Great progress!</p>
          </CardContent>
        </Card>
      </div>

      {/* Monitored Applications */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Monitored Applications</h2>
          <Button variant="link" className="text-blue-500 hover:text-blue-400">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Card
              key={app.id}
              className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{
                        backgroundColor:
                          app.name === "E-Commerce Web"
                            ? "#8b5cf6"
                            : app.name === "Consumer iOS App"
                            ? "#3b82f6"
                            : app.name === "Admin Dashboard"
                            ? "#06b6d4"
                            : "#6366f1",
                      }}
                    >
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{app.name}</h3>
                      <p className="text-xs text-slate-400">
                        {app.latest_version || "v1.0.0"} • {app.environment || "Production"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.is_active
                        ? "bg-green-900/50 text-green-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {app.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Bug Health */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Bug Health</span>
                      <span className="text-sm font-medium text-white">
                        {app.stats?.openBugs || 0} Open
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getHealthColor(
                          app.stats?.openBugs || 0
                        )}`}
                        style={{
                          width: `${Math.min(
                            ((app.stats?.openBugs || 0) / 20) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Bug Counts */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-red-400 font-medium">
                          {app.stats?.criticalBugs || 0}
                        </span>
                        <span className="text-slate-500 ml-1">Critical</span>
                      </div>
                      <div>
                        <span className="text-orange-400 font-medium">
                          {app.stats?.highBugs || 0}
                        </span>
                        <span className="text-slate-500 ml-1">High</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">
                          {app.stats?.lowBugs || 0}
                        </span>
                        <span className="text-slate-500 ml-1">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Application Card */}
          <Card className="bg-slate-900 border-slate-800 border-dashed hover:border-slate-700 transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">
                Add New Application
              </h3>
              <p className="text-sm text-slate-500 text-center mb-4">
                Admin Only
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">John Doe</span> reported
                  a new bug in{" "}
                  <span className="font-medium text-white">E-Commerce Web</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">Jane Smith</span>{" "}
                  resolved bug{" "}
                  <span className="font-medium text-white">#BUG-1234</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">System</span> updated{" "}
                  <span className="font-medium text-white">Admin Dashboard</span>{" "}
                  to v1.2.0
                </p>
                <p className="text-xs text-slate-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberOverviewPageContent;
