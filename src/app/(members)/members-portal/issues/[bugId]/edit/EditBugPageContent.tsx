"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";
import { appService } from "@/mocks/services";
import { useBugs } from "@/contexts/BugsContext";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "@/lib/toast-helpers";

const formSchema = z.object({
  app_id: z.string().min(1, { message: "Please select an application" }),
  version_id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  steps_to_reproduce: z.string().min(1, { message: "Steps to reproduce are required" }),
  expected_behavior: z.string().min(1, { message: "Expected behavior is required" }),
  actual_behavior: z.string().min(1, { message: "Actual behavior is required" }),
  video_url: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  environment: z.enum(["production", "staging", "development"]),
});

const EditBugPageContent = () => {
  const params = useParams();
  const router = useRouter();
  const bugId = params.bugId as string;
  const { bugs, updateBug } = useBugs();

  const [apps, setApps] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      app_id: "",
      version_id: "",
      title: "",
      description: "",
      steps_to_reproduce: "",
      expected_behavior: "",
      actual_behavior: "",
      video_url: "",
      severity: "medium",
      environment: "production",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appsData = await appService.getAll();
        const bugData = bugs.find(b => b.id === bugId);

        if (!bugData) {
          setError("Bug not found");
          setLoading(false);
          return;
        }

        setApps(appsData);

        // Fetch versions for the bug's app
        if (bugData.app_id) {
          const versionsData = await appService.getVersionsByAppId(bugData.app_id);
          setVersions(versionsData);
        }

        // Pre-populate form with bug data
        form.reset({
          app_id: bugData.app_id,
          version_id: bugData.version_id || "",
          title: bugData.title,
          description: bugData.description || "",
          steps_to_reproduce: bugData.steps_to_reproduce || "",
          expected_behavior: bugData.expected_behavior || "",
          actual_behavior: bugData.actual_behavior || "",
          video_url: bugData.video_url || "",
          severity: bugData.severity,
          environment: bugData.environment || "production",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load bug details");
      } finally {
        setLoading(false);
      }
    };

    if (bugs.length > 0) {
      fetchData();
    }
  }, [bugId, form, bugs]);

  const onAppChange = async (appId: string) => {
    form.setValue("app_id", appId);
    form.setValue("version_id", "");

    if (appId) {
      try {
        const versionsData = await appService.getVersionsByAppId(appId);
        setVersions(versionsData);
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    } else {
      setVersions([]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      // Update bug in-memory
      updateBug(bugId, values);

      toast.success("Issue updated", `"${values.title}" has been updated successfully.`);
      router.push(`/members-portal/issues/${bugId}`);
    } catch (error) {
      console.error("Error updating bug:", error);
      toast.error("Update failed", "Failed to update the issue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    appService.getAll().then((appsData) => {
      const bugData = bugs.find(b => b.id === bugId);
      if (!bugData) {
        setError("Bug not found");
        setLoading(false);
        return;
      }
      setApps(appsData);
      if (bugData.app_id) {
        appService.getVersionsByAppId(bugData.app_id).then(versionsData => {
          setVersions(versionsData);
        });
      }
      form.reset({
        app_id: bugData.app_id,
        version_id: bugData.version_id || "",
        title: bugData.title,
        description: bugData.description || "",
        steps_to_reproduce: bugData.steps_to_reproduce || "",
        expected_behavior: bugData.expected_behavior || "",
        actual_behavior: bugData.actual_behavior || "",
        video_url: bugData.video_url || "",
        severity: bugData.severity,
        environment: bugData.environment || "production",
      });
      setLoading(false);
    }).catch(() => {
      setError("Failed to load bug details");
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading bug details..." />
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
        <Link href="/members-portal" className="hover:text-slate-300 transition-colors">
          Overview
        </Link>
        <span className="mx-2">/</span>
        <Link href="/members-portal/issues" className="hover:text-slate-300 transition-colors">
          Issues
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/members-portal/issues/${bugId}`} className="hover:text-slate-300 transition-colors">
          #{bugId.slice(0, 8)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Edit</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href={`/members-portal/issues/${bugId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Issue</h1>
            <p className="text-slate-400">
              Update the details of this bug report
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6 space-y-6">
              {/* Application & Environment Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="app_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Target Application *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => onAppChange(value)}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Select application" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {apps.map((app) => (
                            <SelectItem key={app.id} value={app.id} className="text-white">
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Environment *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="production" className="text-white">Production</SelectItem>
                          <SelectItem value="staging" className="text-white">Staging</SelectItem>
                          <SelectItem value="development" className="text-white">Development</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Version */}
              <FormField
                control={form.control}
                name="version_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Version</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!form.watch("app_id") || versions.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select version (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {versions.map((version) => (
                          <SelectItem key={version.id} value={version.id} className="text-white">
                            {version.version_label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Bug Title *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Login fails when password contains special characters"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Severity */}
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Severity *</FormLabel>
                    <div className="flex gap-2">
                      {[
                        { value: "low", label: "Low ⚪", color: "border-green-600 hover:bg-green-900/20" },
                        { value: "medium", label: "Medium ⚠️", color: "border-yellow-600 hover:bg-yellow-900/20" },
                        { value: "high", label: "High 🔴", color: "border-orange-600 hover:bg-orange-900/20" },
                        { value: "critical", label: "Critical 🚨", color: "border-red-600 hover:bg-red-900/20" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant="outline"
                          className={`flex-1 ${
                            field.value === option.value
                              ? "bg-blue-600 border-blue-600 text-white"
                              : `${option.color} text-white`
                          }`}
                          onClick={() => field.onChange(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the bug in detail..."
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Steps to Reproduce */}
              <FormField
                control={form.control}
                name="steps_to_reproduce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Steps to Reproduce *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="1. Go to login page&#10;2. Enter credentials&#10;3. Click submit"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expected Behavior */}
              <FormField
                control={form.control}
                name="expected_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Expected Behavior *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What should happen?"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actual Behavior */}
              <FormField
                control={form.control}
                name="actual_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Actual Behavior *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What actually happens?"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Video URL */}
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Video URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://loom.com/share/..."
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Link href={`/members-portal/issues/${bugId}`}>
              <Button type="button" variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              disabled={submitting}
            >
              <Save className="h-4 w-4" />
              {submitting ? "Updating..." : "Update Issue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditBugPageContent;
