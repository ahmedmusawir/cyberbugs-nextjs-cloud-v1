"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertTriangle,
  Calendar,
  User,
  Monitor,
  FileText,
  Video,
  Paperclip,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { appService, userService } from "@/mocks/services";
import { useBugs } from "@/contexts/BugsContext";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/lib/toast-helpers";

const BugDetailPageContent = () => {
  const params = useParams();
  const router = useRouter();
  const bugId = params.bugId as string;
  const { bugs, deleteBug } = useBugs();

  const [bug, setBug] = useState<any>(null);
  const [app, setApp] = useState<any>(null);
  const [reporter, setReporter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBugDetails = async () => {
      try {
        const bugData = bugs.find(b => b.id === bugId);

        if (!bugData) {
          setError("Bug not found");
          setLoading(false);
          return;
        }

        setBug(bugData);

        // Fetch related data
        const [appData, reporterData] = await Promise.all([
          appService.getById(bugData.app_id),
          userService.getById(bugData.reported_by),
        ]);

        setApp(appData);
        setReporter(reporterData);
      } catch (error) {
        console.error("Error fetching bug details:", error);
        setError("Failed to load bug details");
      } finally {
        setLoading(false);
      }
    };

    if (bugs.length > 0) {
      fetchBugDetails();
    }
  }, [bugId, bugs]);

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-900/50 text-red-400 border-red-900",
      high: "bg-orange-900/50 text-orange-400 border-orange-900",
      medium: "bg-yellow-900/50 text-yellow-400 border-yellow-900",
      low: "bg-green-900/50 text-green-400 border-green-900",
    };
    return colors[severity] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-900/50 text-blue-400 border-blue-900",
      in_progress: "bg-yellow-900/50 text-yellow-400 border-yellow-900",
      blocked: "bg-red-900/50 text-red-400 border-red-900",
      resolved: "bg-green-900/50 text-green-400 border-green-900",
      closed: "bg-slate-700 text-slate-400 border-slate-700",
    };
    return colors[status] || colors.open;
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const bugData = bugs.find(b => b.id === bugId);
    if (!bugData) {
      setError("Bug not found");
      setLoading(false);
      return;
    }
    setBug(bugData);
    Promise.all([
      appService.getById(bugData.app_id),
      userService.getById(bugData.reported_by),
    ]).then(([appData, reporterData]) => {
      setApp(appData);
      setReporter(reporterData);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load bug details");
      setLoading(false);
    });
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteBug(bugId);
    toast.success("Issue deleted", `"${bug?.title}" has been removed.`);
    router.push("/members-portal/issues");
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading bug details..." />
      </div>
    );
  }

  if (error || !bug) {
    return (
      <div className="p-8">
        <ErrorState
          message={error || "Bug not found"}
          onRetry={error ? handleRetry : undefined}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/members-portal" className="hover:text-slate-300 transition-colors">
          Overview
        </Link>
        <span className="mx-2">/</span>
        <Link href="/members-portal/issues" className="hover:text-slate-300 transition-colors">
          Issues
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">#{bugId.slice(0, 8)}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/members-portal/issues">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{bug.title}</h1>
              <Badge className={`${getSeverityColor(bug.severity)} capitalize`}>
                {bug.severity}
              </Badge>
              <Badge className={`${getStatusColor(bug.status)} capitalize`}>
                {bug.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-slate-400">
              Issue #{bugId.slice(0, 8)} · Reported {new Date(bug.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/members-portal/issues/${bugId}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2 text-red-400 hover:text-red-300 border-red-900 hover:border-red-800"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 whitespace-pre-wrap">
                {bug.description || "No description provided"}
              </p>
            </CardContent>
          </Card>

          {/* Steps to Reproduce */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Steps to Reproduce</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                {bug.steps_to_reproduce?.split('\n').map((step: string, index: number) => (
                  <li key={index} className="pl-2">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Expected vs Actual Behavior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Expected Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 whitespace-pre-wrap">
                  {bug.expected_behavior || "Not specified"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Actual Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 whitespace-pre-wrap">
                  {bug.actual_behavior || "Not specified"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Video/Attachments */}
          {(bug.video_url || bug.attachments?.length > 0) && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Media & Attachments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bug.video_url && (
                  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <Video className="h-5 w-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Screen Recording</p>
                      <a
                        href={bug.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        {bug.video_url}
                      </a>
                    </div>
                  </div>
                )}
                {bug.attachments?.map((attachment: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <Paperclip className="h-5 w-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{attachment.file_name}</p>
                      <p className="text-xs text-slate-400">
                        {(attachment.file_size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Issue Details */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Monitor className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Application</p>
                  <p className="text-sm font-medium text-white">{app?.name || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Environment</p>
                  <p className="text-sm font-medium text-white capitalize">{bug.environment}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Reported By</p>
                  <p className="text-sm font-medium text-white">
                    {reporter?.display_name || reporter?.email || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Created</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(bug.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>

              {bug.updated_at && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Last Updated</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(bug.updated_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <AlertTriangle className="h-4 w-4" />
                Change Severity
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Update Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Issue"
        description={`Are you sure you want to delete "${bug?.title}"? This action cannot be undone.`}
        confirmText="Delete Issue"
        variant="destructive"
      />
    </div>
  );
};

export default BugDetailPageContent;
