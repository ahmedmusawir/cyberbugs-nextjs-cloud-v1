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
  Bug,
  FolderKanban,
  PlusCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <Command className="bg-secondary">
      <CommandInput placeholder="Search..." />
      <CommandList className="px-4">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <Link href="/members-portal">Overview</Link>
          </CommandItem>
          <CommandItem>
            <Bug className="mr-2 h-4 w-4" />
            <Link href="/members-portal/issues">Issues</Link>
          </CommandItem>
          <CommandItem>
            <FolderKanban className="mr-2 h-4 w-4" />
            <Link href="/members-portal/projects">Projects</Link>
          </CommandItem>
          <CommandItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <Link href="/members-portal/report-bug">Report Bug</Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/members-portal/settings">Profile Settings</Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Sidebar;
