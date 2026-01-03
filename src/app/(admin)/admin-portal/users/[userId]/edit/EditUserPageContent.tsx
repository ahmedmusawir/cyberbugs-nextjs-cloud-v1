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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { userService } from "@/mocks/services";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { toast } from "@/lib/toast-helpers";

const formSchema = z.object({
  full_name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["member", "admin", "super_admin"]),
  is_active: z.boolean(),
});

const EditUserPageContent = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      role: "member",
      is_active: true,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getById(userId);

        if (!userData) {
          setError("User not found");
          setLoading(false);
          return;
        }

        // Pre-populate form
        form.reset({
          full_name: userData.full_name || userData.display_name || "",
          email: userData.email,
          role: userData.role,
          is_active: userData.is_active !== false,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      // In demo mode, we just simulate the update
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("User updated", `${values.full_name}'s profile has been updated.`);
      router.push("/admin-portal/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Update failed", "Failed to update user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    userService.getById(userId)
      .then((userData) => {
        if (!userData) {
          setError("User not found");
          setLoading(false);
          return;
        }
        form.reset({
          full_name: userData.full_name || userData.display_name || "",
          email: userData.email,
          role: userData.role,
          is_active: userData.is_active !== false,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user details");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading user details..." />
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
        <Link href="/admin-portal" className="hover:text-slate-300 transition-colors">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <Link href="/admin-portal/users" className="hover:text-slate-300 transition-colors">
          Users
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">Edit</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/admin-portal/users">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit User</h1>
            <p className="text-slate-400">
              Update user information and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6 space-y-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., John Doe"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john.doe@example.com"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      User's primary email address for login and notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Role *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="member" className="text-white">
                          <div>
                            <div className="font-medium">Tester</div>
                            <div className="text-xs text-slate-400">Can report and view bugs</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin" className="text-white">
                          <div>
                            <div className="font-medium">Admin</div>
                            <div className="text-xs text-slate-400">Can manage apps and bugs</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="super_admin" className="text-white">
                          <div>
                            <div className="font-medium">Super Admin</div>
                            <div className="text-xs text-slate-400">Full system access</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-slate-500">
                      Determines what this user can access and modify
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
                      <FormLabel className="text-white">Account Status</FormLabel>
                      <FormDescription className="text-slate-500">
                        {field.value
                          ? "User can log in and access the system"
                          : "User is locked out and cannot access the system"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Button
                        type="button"
                        variant={field.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => field.onChange(!field.value)}
                        className={
                          field.value
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-red-600 text-red-400 hover:bg-red-900/20"
                        }
                      >
                        {field.value ? "Active" : "Inactive"}
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Warning Card */}
          <Card className="bg-yellow-900/20 border-yellow-900/50">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm text-yellow-200">
                <p className="font-medium">⚠️ Important Notes</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-200/80">
                  <li>Changing a user's role will affect their access immediately</li>
                  <li>Setting account to inactive will log the user out</li>
                  <li>Super Admin role should only be granted to trusted administrators</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Link href="/admin-portal/users">
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
              {submitting ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditUserPageContent;
