"use client";

import * as React from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar }  from "./admin-topbar";

export interface AdminUser {
  name?:  string | null;
  email?: string | null;
  image?: string | null;
  role?:  string | null;
}

interface AdminShellProps {
  user:     AdminUser;
  children: React.ReactNode;
}

// This client component owns the interactive sidebar state (collapsed / mobileOpen).
// The parent server layout passes the authenticated user so the sidebar/topbar
// can display real session data without a client-side useSession() call.
export function AdminShell({ user, children }: AdminShellProps) {
  const [collapsed,  setCollapsed]  = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-ivory overflow-hidden">
      <AdminSidebar
        user={user}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar
          user={user}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
