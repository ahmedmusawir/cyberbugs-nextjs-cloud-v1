"use client";

import { useEffect, useState } from "react";
import {
  Bug,
  AlertTriangle,
  Settings,
  Plus,
  Search,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appService, bugService } from "@/mocks/services";
import Link from "next/link";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

interface AdminAppDetailPageContentProps {
  appId: string;
}

const AdminAppDetailPageContent = ({ appId }: AdminAppDetailPageContentProps) => {
  const [app, setApp] = useState<any>(null);
  const [bugs, setBugs] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appData = await appService.getById(appId);
        setApp(appData);

        if (appData) {
          const [bugsData, versionsData] = await Promise.all([
            bugService.getByAppId(appId),
            appService.getVersionsByAppId(appId),
          ]);
          setBugs(bugsData);
          setVersions(versionsData);
        }
      } catch (error) {
        console.error("Error fetching app data:", error);
        setError("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appId]);

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      critical: "bg-red-900/50 text-red-400",
      high: "bg-orange-900/50 text-orange-400",
      medium: "bg-yellow-900/50 text-yellow-400",
      low: "bg-green-900/50 text-green-400",
    };
    return styles[severity] || styles.medium;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: "bg-blue-900/50 text-blue-400",
      in_progress: "bg-yellow-900/50 text-yellow-400",
      resolved: "bg-green-900/50 text-green-400",
      closed: "bg-slate-700 text-slate-400",
    };
    return styles[status] || styles.open;
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    appService.getById(appId)
      .then(appData => {
        setApp(appData);
        if (appData) {
          Promise.all([
            bugService.getByAppId(appId),
            appService.getVersionsByAppId(appId),
          ]).then(([bugsData, versionsData]) => {
            setBugs(bugsData);
            setVersions(versionsData);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Failed to load application details");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading application..." />
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

  if (!app) {
    return (
      <div className="p-8">
        <ErrorState 
          title="Application not found" 
          message="The application you're looking for doesn't exist or has been removed." 
        />
      </div>
    );
  }

  const currentVersion = versions[0];
  const openBugs = bugs.filter((b) => b.status === "open").length;
  const criticalBugs = bugs.filter((b) => b.severity === "critical").length;

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/admin-portal" className="hover:text-slate-300 transition-colors">Dashboard</Link>
        <span className="mx-2">/</span>
        <Link href="/admin-portal/apps" className="hover:text-slate-300 transition-colors">Apps</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{app?.name || "App"}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {app?.name || "Application"} - {app?.platform || "Platform"}
          </h1>
          <p className="text-slate-400">
            Manage application versions, track reported issues, and monitor deployment health.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Log Issue
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Open Bugs
            </CardTitle>
            <Bug className="h-8 w-8 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{openBugs}</div>
            <p className="text-xs text-green-500 mt-1">↗ +2 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Critical Issues
            </CardTitle>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{criticalBugs}</div>
            <p className="text-xs text-orange-500 mt-1">Needs Attention</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Live Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">
              {currentVersion?.version_label || "v1.0.0"}
            </div>
            <p className="text-xs text-green-500 mt-1">Deployed 2 days ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reported Issues Table */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Reported Issues</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search issues..."
                    className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-2 text-xs font-medium text-slate-400">
                        ID
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-slate-400">
                        Severity
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-slate-400">
                        Issue Summary
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-slate-400">
                        Reporter
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bugs.slice(0, 5).map((bug, index) => (
                      <tr
                        key={bug.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="py-3 px-2 text-sm text-slate-400">
                          #BUG-{1024 - index}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSeverityBadge(
                              bug.severity
                            )}`}
                          >
                            {bug.severity}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-slate-300 max-w-[200px] truncate">
                          {bug.title}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                              {bug.reported_by?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="text-sm text-slate-400">
                              {bug.reported_by?.split("-")[0] || "user"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                              bug.status
                            )}`}
                          >
                            {bug.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                <span className="text-sm text-slate-500">
                  Showing {Math.min(bugs.length, 5)} of {bugs.length} issues
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Version Control */}
        <div>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Version Control</CardTitle>
                <Button
                  variant="link"
                  className="text-blue-500 hover:text-blue-400 p-0"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Current Live Version */}
              <div className="bg-slate-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-green-500 font-medium">
                    CURRENT LIVE
                  </span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {currentVersion?.version_label || "v4.5.1"}
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  {currentVersion?.release_notes ||
                    "Hotfix for login crash on Android 12 devices."}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "98%" }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">98% Stable</span>
                </div>
              </div>

              {/* Draft New Version Button */}
              <Button
                variant="outline"
                className="w-full mb-6 gap-2 border-dashed"
              >
                <Plus className="h-4 w-4" />
                Draft New Version
              </Button>

              {/* Version History */}
              <div>
                <h4 className="text-xs font-medium text-slate-400 mb-3">
                  HISTORY
                </h4>
                <div className="space-y-4">
                  {versions.slice(1, 4).map((version, index) => (
                    <div
                      key={version.id}
                      className="flex items-start gap-3 pb-4 border-b border-slate-800 last:border-0"
                    >
                      <div className="w-2 h-2 rounded-full bg-slate-600 mt-2" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {version.version_label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Date(version.deployed_at).toLocaleDateString()} •{" "}
                          {index === 0
                            ? "Major Update"
                            : index === 1
                            ? "Maintenance"
                            : "Hotfix"}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {version.release_notes ||
                            "Bug fixes and performance improvements."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAppDetailPageContent;
