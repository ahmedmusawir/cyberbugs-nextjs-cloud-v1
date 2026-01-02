"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  RotateCcw,
  Ban,
  Download,
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
import { userService } from "@/mocks/services";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/lib/toast-helpers";

const AdminUsersPageContent = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userService.getAll();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-blue-900/50 text-blue-400",
      member: "bg-purple-900/50 text-purple-400",
      superadmin: "bg-red-900/50 text-red-400",
    };
    return styles[role] || styles.member;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-green-900/50 text-green-400"
      : "bg-slate-700 text-slate-400";
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    userService.getAll()
      .then(usersData => {
        setUsers(usersData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success("User removed", `${userToDelete.full_name} has been removed from the system.`);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading users..." />
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
        <span>Home</span>
        <span className="mx-2">/</span>
        <span className="text-slate-300">User Management</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">
            Manage user access, roles, and account status.
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or ID..."
                className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Role:</span>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">All Roles</SelectItem>
                    <SelectItem value="admin" className="text-white">Admin</SelectItem>
                    <SelectItem value="member" className="text-white">Tester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white">All Status</SelectItem>
                    <SelectItem value="active" className="text-white">Active</SelectItem>
                    <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
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
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Last Login
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-800 hover:bg-slate-800/50"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-800"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{
                            backgroundColor:
                              index % 4 === 0
                                ? "#6366f1"
                                : index % 4 === 1
                                ? "#8b5cf6"
                                : index % 4 === 2
                                ? "#06b6d4"
                                : "#f59e0b",
                          }}
                        >
                          {user.full_name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.full_name || "Unknown User"}
                          </p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role === "member" ? "Tester" : user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          user.is_active
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            user.is_active ? "bg-green-400" : "bg-slate-400"
                          }`}
                        />
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-400">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }) +
                          " " +
                          new Date(user.last_login).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-white"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-400"
                        >
                          <Ban className="h-4 w-4" />
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
              Showing <span className="text-white">1</span> to{" "}
              <span className="text-white">{users.length}</span> of{" "}
              <span className="text-white">24</span> results
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-blue-600 border-blue-600 text-white"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                3
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPageContent;
