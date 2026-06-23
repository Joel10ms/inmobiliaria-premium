// Auth pages (login, forgot-password, etc.) get a bare layout — no Navbar, no Sidebar
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
