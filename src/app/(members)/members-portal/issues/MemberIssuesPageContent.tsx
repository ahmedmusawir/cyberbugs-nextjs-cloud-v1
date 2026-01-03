"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bug,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Download,
  Plus,
  Filter,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useBugs } from "@/contexts/BugsContext";
import { useApps } from "@/contexts/AppsContext";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/lib/toast-helpers";
import Link from "next/link";

const MemberIssuesPageContent = () => {
  const router = useRouter();
  const { bugs, deleteBug } = useBugs();
  const { apps } = useApps();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appFilter, setAppFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bugToDelete, setBugToDelete] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Calculate stats from bugs
    const calculateStats = () => {
      const byStatus = bugs.reduce((acc: any, bug: any) => {
        acc[bug.status] = (acc[bug.status] || 0) + 1;
        return acc;
      }, {});

      const bySeverity = bugs.reduce((acc: any, bug: any) => {
        acc[bug.severity] = (acc[bug.severity] || 0) + 1;
        return acc;
      }, {});

      setStats({ byStatus, bySeverity });
    };

    calculateStats();
  }, [bugs]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appFilter, statusFilter, severityFilter, searchQuery]);

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
      in_review: "bg-purple-900/50 text-purple-400",
      resolved: "bg-green-900/50 text-green-400",
      closed: "bg-slate-700 text-slate-400",
    };
    return styles[status] || styles.open;
  };

  const getAppName = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    return app?.name || "Unknown App";
  };

  // Filter and search bugs
  const filteredBugs = bugs.filter((bug) => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        bug.title.toLowerCase().includes(searchLower) ||
        bug.id.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // App filter
    if (appFilter !== "all" && bug.app_id !== appFilter) return false;

    // Status filter
    if (statusFilter !== "all" && bug.status !== statusFilter) return false;

    // Severity filter
    if (severityFilter !== "all" && bug.severity !== severityFilter) return false;

    return true;
  });

  const handleDeleteClick = (bug: any) => {
    setBugToDelete(bug);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (bugToDelete) {
      deleteBug(bugToDelete.id);
      toast.success("Issue deleted", `"${bugToDelete.title}" has been removed.`);
      setBugToDelete(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredBugs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBugs = filteredBugs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Issues List</h1>
          <p className="text-slate-400">
            Manage and track reported bugs across all applications.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/members-portal/report-bug">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Report Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Open
            </CardTitle>
            <Bug className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.byStatus.open || 0}
            </div>
            <p className="text-xs text-red-500 mt-1">↗ 5%</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Critical
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.bySeverity.critical || 0}
            </div>
            <p className="text-xs text-red-500 mt-1">↑ 2</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              In Progress
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.byStatus.in_progress || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Stable</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Resolved This Week
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats?.byStatus.resolved || 0}
            </div>
            <p className="text-xs text-green-500 mt-1">↗ 12%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search issues by title, ID..."
                className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={appFilter} onValueChange={setAppFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="All Applications" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">
                  All Applications
                </SelectItem>
                {apps.map((app) => (
                  <SelectItem key={app.id} value={app.id} className="text-white">
                    {app.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>FILTERS:</span>
              <Button
                variant={statusFilter === "open" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("open")}
                className={statusFilter === "open" ? "bg-blue-600" : ""}
              >
                Status: Open
              </Button>
              <Button
                variant={severityFilter !== "all" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSeverityFilter(severityFilter === "all" ? "critical" : "all")
                }
                className={severityFilter !== "all" ? "bg-blue-600" : ""}
              >
                Severity: {severityFilter === "all" ? "All" : severityFilter}
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                Assignee: Me
                <X className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 w-8">
                    <input
                      type="checkbox"
                      className="rounded border-slate-600 bg-slate-800"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Issue
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Application
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Severity
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Reporter
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Date
                  </th>
                  <th className="text-right py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedBugs.map((bug, index) => (
                  <tr
                    key={bug.id}
                    className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                    onClick={() => router.push(`/members-portal/issues/${bug.id}`)}
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-800"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-white">{bug.title}</p>
                        <p className="text-xs text-slate-500">
                          #BUG-{1024 - index}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-300">
                      {getAppName(bug.app_id)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSeverityBadge(
                          bug.severity
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            bug.severity === "critical"
                              ? "bg-red-400"
                              : bug.severity === "high"
                              ? "bg-orange-400"
                              : bug.severity === "medium"
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                        />
                        {bug.severity}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                          bug.status
                        )}`}
                      >
                        {bug.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                          {bug.reported_by?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="text-sm text-slate-400">
                          {["Sarah Smith", "Alex Johnson", "Mike Chen", "Emily Davis", "David Wilson"][index % 5]}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-400">
                      {["2 hrs ago", "5 hrs ago", "Yesterday", "2 days ago", "3 days ago"][index % 5]}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(bug);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <span className="text-sm text-slate-500">
              Showing <span className="text-white">{startIndex + 1}</span> to{" "}
              <span className="text-white">{Math.min(endIndex, filteredBugs.length)}</span> of{" "}
              <span className="text-white">{filteredBugs.length}</span> results
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {totalPages <= 7 ? (
                // Show all pages if 7 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    className={`h-8 w-8 ${
                      currentPage === page
                        ? "bg-blue-600 border-blue-600 text-white"
                        : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))
              ) : (
                // Show smart pagination for many pages
                <>
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </Button>
                      <span className="text-slate-500 px-2">...</span>
                    </>
                  )}
                  {Array.from({ length: 3 }, (_, i) => {
                    const page = currentPage - 1 + i;
                    if (page < 1 || page > totalPages) return null;
                    return (
                      <Button
                        key={page}
                        variant="outline"
                        size="sm"
                        className={`h-8 w-8 ${
                          currentPage === page
                            ? "bg-blue-600 border-blue-600 text-white"
                            : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {currentPage < totalPages - 2 && (
                    <>
                      <span className="text-slate-500 px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </>
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Issue"
        description={`Are you sure you want to delete "${bugToDelete?.title || 'this issue'}"? This action cannot be undone.`}
        confirmText="Delete Issue"
        variant="destructive"
      />
    </div>
  );
};

export default MemberIssuesPageContent;
