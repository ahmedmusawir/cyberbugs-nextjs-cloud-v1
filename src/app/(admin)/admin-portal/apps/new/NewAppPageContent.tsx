"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { ArrowLeft, Plus, X } from "lucide-react";
import { useApps } from "@/contexts/AppsContext";
import { toast } from "@/lib/toast-helpers";

const formSchema = z.object({
  name: z.string().min(1, { message: "Application name is required" }),
  description: z.string().optional(),
  platform: z.enum(["web", "ios", "android", "desktop", "mobile"]),
  is_active: z.boolean().default(true),
});

const NewAppPageContent = () => {
  const router = useRouter();
  const { addApp } = useApps();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      platform: "web",
      is_active: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      // Create app in-memory
      addApp(values);

      toast.success("Application created", `"${values.name}" has been added successfully.`);
      router.push("/admin-portal/apps");
    } catch (error) {
      console.error("Error creating app:", error);
      toast.error("Creation failed", "Failed to create the application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/admin-portal" className="hover:text-slate-300 transition-colors">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <Link href="/admin-portal/apps" className="hover:text-slate-300 transition-colors">
          Apps
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">New</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/admin-portal/apps">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Add New Application</h1>
            <p className="text-slate-400">
              Register a new application to start tracking bugs
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6 space-y-6">
              {/* Application Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Application Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., DockBloxx, Apollo CRM"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      The name of your application or service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Platform */}
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Platform *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="web" className="text-white">Web Application</SelectItem>
                        <SelectItem value="ios" className="text-white">iOS</SelectItem>
                        <SelectItem value="android" className="text-white">Android</SelectItem>
                        <SelectItem value="mobile" className="text-white">Mobile (Cross-platform)</SelectItem>
                        <SelectItem value="desktop" className="text-white">Desktop</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-slate-500">
                      The primary platform for this application
                    </FormDescription>
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
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief description of the application..."
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      Optional description to help identify this application
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4 bg-slate-800">
                    <div className="space-y-0.5">
                      <FormLabel className="text-white">Active Status</FormLabel>
                      <FormDescription className="text-slate-500">
                        Enable bug tracking for this application
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(!field.value)}
                        className={field.value ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {field.value ? "Active" : "Inactive"}
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm text-slate-400">
                <p className="font-medium text-white">What happens next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>The application will appear in your applications list</li>
                  <li>Team members can start reporting bugs for this application</li>
                  <li>You can add versions and manage bug tracking settings</li>
                  <li>Access analytics and reports for this application</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Link href="/admin-portal/apps">
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
              <Plus className="h-4 w-4" />
              {submitting ? "Creating..." : "Create Application"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewAppPageContent;
