'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  AppWindow,
  Users,
  Settings,
  Bug,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin-portal',
    icon: LayoutDashboard,
  },
  {
    label: 'Apps',
    href: '/admin-portal/apps',
    icon: AppWindow,
  },
  {
    label: 'User Management',
    href: '/admin-portal/users',
    icon: Users,
  },
  {
    label: 'Settings',
    href: '/admin-portal/settings',
    icon: Settings,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Bug className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-lg font-bold">BugTracker</h1>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin-portal' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          CyberBugs v1.0 • Admin
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;
