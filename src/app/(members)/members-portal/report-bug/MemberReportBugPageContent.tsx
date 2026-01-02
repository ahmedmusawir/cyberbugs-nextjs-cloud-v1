"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { appService, bugService } from "@/mocks/services";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  app_id: z.string().min(1, { message: "Please select an application" }),
  version_id: z.string().min(1, { message: "Please select a version" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  steps_to_reproduce: z.string().min(1, { message: "Steps to reproduce are required" }),
  expected_behavior: z.string().min(1, { message: "Expected behavior is required" }),
  actual_behavior: z.string().min(1, { message: "Actual behavior is required" }),
  video_url: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  environment: z.enum(["production", "staging", "development"]),
});

const MemberReportBugPageContent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [apps, setApps] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reproSteps, setReproSteps] = useState<string[]>(["", "", ""]);

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
    const fetchApps = async () => {
      try {
        const appsData = await appService.getAll();
        setApps(appsData);
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    };

    fetchApps();
  }, []);

  const handleAppChange = async (appId: string) => {
    form.setValue("app_id", appId);
    form.setValue("version_id", "");
    
    try {
      const versionsData = await appService.getVersionsByAppId(appId);
      setVersions(versionsData);
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  const handleAddStep = () => {
    setReproSteps([...reproSteps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    if (reproSteps.length > 1) {
      const newSteps = reproSteps.filter((_, i) => i !== index);
      setReproSteps(newSteps);
      form.setValue("steps_to_reproduce", newSteps.filter(s => s).join("\n"));
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...reproSteps];
    newSteps[index] = value;
    setReproSteps(newSteps);
    form.setValue("steps_to_reproduce", newSteps.filter(s => s).join("\n"));
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await bugService.create({
        ...data,
        reported_by: "current-user-id",
        status: "open",
      });

      toast({
        title: "Bug Reported Successfully",
        description: "Your bug report has been submitted to the development team.",
      });

      router.push("/members-portal/issues");
    } catch (error) {
      console.error("Error creating bug:", error);
      toast({
        title: "Error",
        description: "Failed to submit bug report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span>Projects</span>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Report Bug</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Report a Defect</h1>
        <p className="text-slate-400">
          Submit a new bug report for the development team to review.
        </p>
      </div>

      {/* Form */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* App and Environment Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="app_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Target Application <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={handleAppChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Select an application" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {apps.map((app) => (
                            <SelectItem
                              key={app.id}
                              value={app.id}
                              className="text-white hover:bg-slate-700"
                            >
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Environment</FormLabel>
                      <div className="flex gap-2">
                        {["production", "staging", "development"].map((env) => (
                          <Button
                            key={env}
                            type="button"
                            variant={field.value === env ? "default" : "outline"}
                            className={`flex-1 ${
                              field.value === env
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            }`}
                            onClick={() => field.onChange(env)}
                          >
                            {env.charAt(0).toUpperCase() + env.slice(1)}
                          </Button>
                        ))}
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Version Field */}
              <FormField
                control={form.control}
                name="version_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Version</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("app_id")}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select a version" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {versions.map((version) => (
                          <SelectItem
                            key={version.id}
                            value={version.id}
                            className="text-white hover:bg-slate-700"
                          >
                            {version.version_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Bug Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      Bug Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Login fails when password contains special characters"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Severity */}
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Severity</FormLabel>
                    <div className="flex gap-2">
                      {[
                        { value: "low", label: "Low", icon: "⚪" },
                        { value: "medium", label: "Medium", icon: "⚠️" },
                        { value: "high", label: "High", icon: "🔴" },
                        { value: "critical", label: "Critical", icon: "🚨" },
                      ].map((severity) => (
                        <Button
                          key={severity.value}
                          type="button"
                          variant={field.value === severity.value ? "default" : "outline"}
                          className={`flex-1 ${
                            field.value === severity.value
                              ? severity.value === "low"
                                ? "bg-slate-600 hover:bg-slate-700"
                                : severity.value === "medium"
                                ? "bg-yellow-600 hover:bg-yellow-700"
                                : severity.value === "high"
                                ? "bg-orange-600 hover:bg-orange-700"
                                : "bg-red-600 hover:bg-red-700"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                          }`}
                          onClick={() => field.onChange(severity.value)}
                        >
                          {severity.icon} {severity.label}
                        </Button>
                      ))}
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the issue in detail..."
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Steps to Reproduce */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel className="text-slate-300">
                    Steps to Reproduce <span className="text-red-500">*</span>
                  </FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddStep}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Step
                  </Button>
                </div>
                <div className="space-y-3">
                  {reproSteps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-slate-400 mt-3">{index + 1}.</span>
                      <Input
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        placeholder={
                          index === 0
                            ? "Go to the login page"
                            : index === 1
                            ? "Enter 'admin' as username"
                            : "Enter next step..."
                        }
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                      {reproSteps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStep(index)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected vs Actual Behavior */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="expected_behavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Expected Behavior <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What should happen..."
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actual_behavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">
                        Actual Behavior <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What actually happens..."
                          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Video URL */}
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Video URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Attachments */}
              <div>
                <FormLabel className="text-slate-300 mb-2 block">Attachments</FormLabel>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors">
                  <Upload className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    SVG, PNG, JPG or GIF (max. 300x400px)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                  onClick={() => router.back()}
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberReportBugPageContent;
