import { ReactNode } from "react";
import { MemberSidebar } from "@/components/cyberbugs/layout";
import { protectPage } from "@/utils/supabase/actions";
import NavbarHome from "@/components/global/NavbarHome";

interface LayoutProps {
  children: ReactNode;
}

export default async function MemberLayout({ children }: LayoutProps) {
  await protectPage(["member"]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Common Navbar */}
      <NavbarHome />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <MemberSidebar />
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
