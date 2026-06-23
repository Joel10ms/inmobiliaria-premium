import { redirect }    from "next/navigation";
import { auth }        from "@/auth";
import { AdminShell }  from "@/components/admin/admin-shell";

// Server Component — reads the session and protects the route.
// If the middleware already redirected unauthenticated users, this
// is a second safety net for direct server-side rendering.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AdminShell user={session.user}>
      {children}
    </AdminShell>
  );
}
