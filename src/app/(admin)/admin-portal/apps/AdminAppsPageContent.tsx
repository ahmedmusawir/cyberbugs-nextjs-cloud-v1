"use client";

import { useEffect, useState } from "react";
import {
  Bug,
  Plus,
  Search,
  Smartphone,
  Monitor,
  Globe,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApps } from "@/contexts/AppsContext";
import Link from "next/link";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/lib/toast-helpers";

const AdminAppsPageContent = () => {
  const { apps, deleteApp } = useApps();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<any>(null);


  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "ios":
      case "android":
      case "mobile":
        return <Smartphone className="h-6 w-6" />;
      case "web":
        return <Globe className="h-6 w-6" />;
      default:
        return <Monitor className="h-6 w-6" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "ios":
        return "bg-blue-500/20 text-blue-400";
      case "android":
        return "bg-green-500/20 text-green-400";
      case "web":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };


  const handleDeleteClick = (e: React.MouseEvent, app: any) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (appToDelete) {
      deleteApp(appToDelete.id);
      toast.success("Application deleted", `"${appToDelete.name}" has been removed.`);
      setAppToDelete(null);
    }
  };

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/admin-portal" className="hover:text-slate-300 transition-colors">Dashboard</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Apps</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
          <p className="text-slate-400">
            Manage and monitor all registered applications in your organization.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search apps..."
              className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Link href="/admin-portal/apps/new">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Application
            </Button>
          </Link>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Link key={app.id} href={`/admin-portal/apps/${app.id}`}>
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
              <CardContent className="p-6">
                {/* App Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getPlatformColor(app.platform)}`}>
                    {getPlatformIcon(app.platform)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteClick(e, app)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </div>
                </div>

                {/* App Info */}
                <h3 className="text-xl font-semibold text-white mb-1">{app.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{app.platform} Application</p>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-slate-300">
                      {app.openBugs || 0} open bugs
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    v{app.currentVersion || "1.0.0"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Add New App Card */}
        <Link href="/admin-portal/apps/new">
          <Card className="bg-slate-900/50 border-slate-800 border-dashed hover:border-slate-700 transition-all cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              <div className="p-4 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors mb-4">
                <Plus className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-400 font-medium">Add New Application</p>
              <p className="text-sm text-slate-500 mt-1">Register a new app to track</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        description={`Are you sure you want to delete "${appToDelete?.name || 'this application'}"? All associated bugs and data will also be removed. This action cannot be undone.`}
        confirmText="Delete Application"
        variant="destructive"
      />
    </div>
  );
};

export default AdminAppsPageContent;
