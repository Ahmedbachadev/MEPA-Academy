import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeading } from "@/components/admin/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/messages")({ component: MessagesAdmin });

function MessagesAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function toggleRead(id: string, current: boolean) {
    const { error } = await supabase.from("contact_messages").update({ is_read: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  }

  return (
    <div className="space-y-4">
      <AdminHeading title="Contact Messages" description={`${data.length} total`} />
      {data.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
      {data.map((m) => (
        <Card key={m.id} className={m.is_read ? "" : "border-brand-blue/40"}>
          <CardContent className="p-4 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{m.name} <span className="text-muted-foreground font-normal">· {m.email}</span></div>
                {m.phone && <div className="text-xs text-muted-foreground">{m.phone}</div>}
                <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleRead(m.id, m.is_read)}>
                  {m.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  {m.is_read ? "Mark unread" : "Mark read"}
                </Button>
                <Button variant="destructive" size="icon" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm">{m.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
