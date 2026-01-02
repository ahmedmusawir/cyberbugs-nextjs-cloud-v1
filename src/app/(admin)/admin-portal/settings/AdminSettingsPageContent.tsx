"use client";

import { useState } from "react";
import {
  Settings,
  Users,
  Shield,
  Puzzle,
  Bell,
  Database,
  FileText,
  Save,
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

const AdminSettingsPageContent = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(true);

  const sidebarItems = [
    { id: "general", label: "General Settings", icon: Settings },
    { id: "users", label: "Users & Permissions", icon: Users },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Puzzle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "data", label: "Data & Maintenance", icon: Database },
    { id: "audit", label: "Audit Logs", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Settings Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 p-4">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
            SA
          </div>
          <div>
            <p className="font-medium text-white">System Admin</p>
            <p className="text-xs text-slate-400">v2.4.0</p>
          </div>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              General Settings
            </h1>
            <p className="text-slate-400">
              Configure global application preferences, defaults, and branding for your instance.
            </p>
          </div>

          {/* Application Profile */}
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Application Profile
              </CardTitle>
              <p className="text-sm text-slate-400">
                Basic information displayed to users and in emails.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Application Name
                  </label>
                  <Input
                    defaultValue="Enterprise Bug Tracker"
                    className="bg-slate-800 border-slate-700 text-white"
                    onChange={() => setHasChanges(true)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Support Email
                  </label>
                  <Input
                    defaultValue="admin@bugtracker.internal"
                    className="bg-slate-800 border-slate-700 text-white"
                    onChange={() => setHasChanges(true)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Default Language
                  </label>
                  <Select defaultValue="en">
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="en" className="text-white">
                        English (US)
                      </SelectItem>
                      <SelectItem value="es" className="text-white">
                        Spanish
                      </SelectItem>
                      <SelectItem value="fr" className="text-white">
                        French
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timezone
                  </label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="utc" className="text-white">
                        (GMT+00:00) UTC
                      </SelectItem>
                      <SelectItem value="est" className="text-white">
                        (GMT-05:00) Eastern
                      </SelectItem>
                      <SelectItem value="pst" className="text-white">
                        (GMT-08:00) Pacific
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow & Policies */}
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Workflow & Policies
              </CardTitle>
              <p className="text-sm text-slate-400">
                Define how bugs are retained and managed over time.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto-close Stale Bugs */}
              <div className="flex items-center justify-between py-4 border-b border-slate-800">
                <div>
                  <h4 className="font-medium text-white">Auto-close Stale Bugs</h4>
                  <p className="text-sm text-slate-400">
                    Automatically close bugs that haven&apos;t been updated in 90 days.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Bug Retention Policy */}
              <div className="flex items-center justify-between py-4 border-b border-slate-800">
                <div>
                  <h4 className="font-medium text-white">Bug Retention Policy</h4>
                  <p className="text-sm text-slate-400">
                    How long to keep closed bugs before permanent deletion.
                  </p>
                </div>
                <Select defaultValue="indefinitely">
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="indefinitely" className="text-white">
                      Indefinitely
                    </SelectItem>
                    <SelectItem value="1year" className="text-white">
                      1 Year
                    </SelectItem>
                    <SelectItem value="2years" className="text-white">
                      2 Years
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Allow Tester Attachments */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="font-medium text-white">Allow Tester Attachments</h4>
                  <p className="text-sm text-slate-400">
                    Testers can upload images and logs (max 10MB).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          {hasChanges && (
            <div className="fixed bottom-0 left-64 right-0 bg-slate-900 border-t border-slate-800 p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Unsaved changes in General Settings
                </span>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setHasChanges(false)}
                  >
                    Discard
                  </Button>
                  <Button
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setHasChanges(false)}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPageContent;
