import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeading } from "@/components/admin/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, BookOpen, Mail, Activity, Camera } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

const counters = [
  { key: "activities", label: "Activities", icon: Activity, to: "/admin/activities" },
  { key: "events", label: "Events", icon: Calendar, to: "/admin/events" },
  { key: "courses", label: "Courses", icon: BookOpen, to: "/admin/courses" },
  { key: "campus_gallery", label: "Gallery", icon: Camera, to: "/admin/gallery" },
  { key: "contact_messages", label: "Messages", icon: Mail, to: "/admin/messages" },
  { key: "user_roles", label: "Roles", icon: Users, to: "/admin" },
] as const;

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        counters.map(async (c) => {
          const { count } = await supabase.from(c.key).select("id", { count: "exact", head: true });
          return [c.key, count ?? 0] as const;
        })
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  return (
    <div>
      <AdminHeading title="Dashboard" description="Overview of MEPA Academy content." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counters.map((c) => (
          <Link key={c.key} to={c.to as "/"}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{c.label}</CardTitle>
                <c.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data?.[c.key] ?? "—"}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
