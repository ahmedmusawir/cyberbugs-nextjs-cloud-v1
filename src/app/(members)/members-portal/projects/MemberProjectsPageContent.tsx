"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appService } from "@/mocks/services";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

const MemberProjectsPageContent = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const appsData = await appService.getAllWithStats();
        setApps(appsData);
      } catch (error) {
        console.error("Error fetching apps:", error);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-900/50 text-green-400",
      maintenance: "bg-yellow-900/50 text-yellow-400",
      archived: "bg-slate-700 text-slate-400",
    };
    return styles[status] || styles.active;
  };

  const getProjectIcon = (index: number) => {
    const colors = ["#8b5cf6", "#ef4444", "#3b82f6", "#06b6d4"];
    const icons = ["⚡", "🛒", "📊", "💳"];
    return { color: colors[index % 4], icon: icons[index % 4] };
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    appService.getAllWithStats()
      .then(appsData => {
        setApps(appsData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading projects..." />
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
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4">
        <span>Dashboard</span>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Projects</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">
            Manage your applications, track bug reports, and monitor project health status across your organization.
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search projects by name, ID or owner..."
                className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">STATUS:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="active" className="text-white">
                      Active
                    </SelectItem>
                    <SelectItem value="maintenance" className="text-white">
                      Maintenance
                    </SelectItem>
                    <SelectItem value="archived" className="text-white">
                      Archived
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">SORT:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="newest" className="text-white">
                      Newest First
                    </SelectItem>
                    <SelectItem value="oldest" className="text-white">
                      Oldest First
                    </SelectItem>
                    <SelectItem value="name" className="text-white">
                      Name A-Z
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex border border-slate-700 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-r-none ${
                    viewMode === "grid" ? "bg-slate-800" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-l-none ${
                    viewMode === "list" ? "bg-slate-800" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Project
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Bugs Reported
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Team Lead
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Created
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app, index) => {
                  const { color, icon } = getProjectIcon(index);
                  const statuses = ["active", "maintenance", "active", "archived"];
                  const status = statuses[index % 4];
                  const teamLeads = ["Sarah Connor", "Michael Chen", "Alex Morgan", "David Kim"];
                  const dates = ["Oct 24, 2023", "Sep 12, 2023", "Aug 04, 2023", "Jul 15, 2023"];

                  return (
                    <tr
                      key={app.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                            style={{ backgroundColor: color }}
                          >
                            {icon}
                          </div>
                          <div>
                            <p className="font-medium text-white">{app.name}</p>
                            <p className="text-xs text-slate-500">
                              {app.latest_version || "v2.4.0"} • {app.platform || "Web"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                            status
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              status === "active"
                                ? "bg-green-400"
                                : status === "maintenance"
                                ? "bg-yellow-400"
                                : "bg-slate-400"
                            }`}
                          />
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className="text-red-400 font-medium">
                            {app.stats?.openBugs || Math.floor(Math.random() * 20)} Open
                          </span>
                          <span className="text-slate-500 ml-1">
                            {app.stats?.totalBugs || Math.floor(Math.random() * 200)} Total
                          </span>
                          <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-red-500 h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  ((app.stats?.openBugs || 10) / 50) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                            {teamLeads[index % 4].charAt(0)}
                          </div>
                          <span className="text-sm text-slate-300">
                            {teamLeads[index % 4]}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-400">
                        {dates[index % 4]}
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <span className="text-sm text-slate-500">
              Showing <span className="text-white">1-{apps.length}</span> of{" "}
              <span className="text-white">12</span> projects
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-600 border-blue-600 text-white"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberProjectsPageContent;
