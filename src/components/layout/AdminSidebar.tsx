import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  AppWindow,
  Users,
  Settings,
  Bug,
} from "lucide-react";
import Link from "next/link";

const AdminSidebar = () => {
  return (
    <Command className="bg-secondary">
      <CommandInput placeholder="Search..." />
      <CommandList className="px-4">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <Link href="/admin-portal">Dashboard</Link>
          </CommandItem>
          <CommandItem>
            <Bug className="mr-2 h-4 w-4" />
            <Link href="/admin-portal/apps">Apps</Link>
          </CommandItem>
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <Link href="/admin-portal/users">Users</Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/admin-portal/settings">Settings</Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AdminSidebar;
