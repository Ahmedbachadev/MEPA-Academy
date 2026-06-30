import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Sparkles,
  Info,
  Activity,
  Calendar,
  BookOpen,
  Camera,
  Settings as SettingsIcon,
  Mail,
  LogOut,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — MEPA Academy" }] }),
  component: AdminShell,
});

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/hero", label: "Hero", icon: Sparkles },
  { to: "/admin/vision-mission", label: "Vision & Mission", icon: ShieldCheck },
  { to: "/admin/about", label: "About", icon: Info },
  { to: "/admin/activities", label: "Activities", icon: Activity },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/staff", label: "Staff", icon: Users2 },
  { to: "/admin/gallery", label: "Gallery", icon: Camera },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function AdminShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        navigate({ to: "/auth" });
        return;
      }

      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });

      if (cancelled) return;

      if (error) {
        console.error(error);
        setChecking(false);
        return;
      }

      setIsAdmin(Boolean(data));
      setChecking(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading admin...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <ShieldCheck className="mx-auto h-10 w-10 text-brand-blue" />

          <h1 className="text-2xl font-bold">
            Access Denied
          </h1>

          <p className="text-sm text-muted-foreground">
            Your account does not have administrator permissions.
            Please contact the system administrator.
          </p>

          <Button onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="p-4 border-b">
          <Logo />
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to as "/"}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t space-y-2">
          <Link
            to="/"
            className="block text-xs text-muted-foreground hover:text-foreground"
          >
            ← View website
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between border-b bg-card px-4 py-3">
          <Logo />

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <div className="md:hidden border-b bg-card overflow-x-auto">
          <div className="flex gap-1 p-2">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to as "/"}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-1.5 text-xs",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export { ImageIcon };