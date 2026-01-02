"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Users,
  Settings,
  Trash2,
  Pencil,
  Plus,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MemberSettingsPageContent = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "users", label: "User Management", icon: Users, section: "ADMIN PANEL" },
    { id: "system", label: "System Config", icon: Settings, section: "ADMIN PANEL" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-slate-400">
              Manage your personal information, security preferences, and system access.
            </p>
          </div>

          {/* Personal Information */}
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Personal Information
              </CardTitle>
              <p className="text-sm text-slate-400">
                Update your photo and personal details.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xl font-medium">
                  JD
                </div>
                <div className="flex gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Change Avatar
                  </Button>
                  <Button variant="outline" className="text-red-400 hover:text-red-300">
                    Delete
                  </Button>
                </div>
                <span className="text-xs text-slate-500">
                  JPG, GIF or PNG. 1MB max.
                </span>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name
                  </label>
                  <Input
                    defaultValue="John"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name
                  </label>
                  <Input
                    defaultValue="Doe"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Email and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ✉
                    </span>
                    <Input
                      defaultValue="john.doe@example.com"
                      className="pl-9 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Role
                  </label>
                  <Input
                    defaultValue="Senior QA Tester"
                    className="bg-slate-800 border-slate-700 text-white"
                    disabled
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bio
                </label>
                <Textarea
                  defaultValue="Senior tester with 5+ years of experience in automation and manual testing."
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                />
                <p className="text-xs text-slate-500 mt-1 text-right">
                  250 characters left
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">Security</CardTitle>
              <p className="text-sm text-slate-400">
                Manage your password and 2-factor authentication.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    defaultValue="********"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">Notifications</CardTitle>
              <p className="text-sm text-slate-400">
                Choose how you receive updates.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-3">
                  EMAIL ALERTS
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "New bug assigned to me", defaultChecked: true },
                    { label: "Status change on my reported bugs", defaultChecked: true },
                    { label: "Mentions in comments", defaultChecked: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-300">{item.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-3">
                  IN-APP NOTIFICATIONS
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "Critical bug alerts", defaultChecked: true },
                    { label: "New team member added", defaultChecked: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-300">{item.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

    </div>
  );
};

export default MemberSettingsPageContent;
