import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { eventsQuery } from "@/lib/site-queries";
import { AdminHeading, Field } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/events")({ component: EventsAdmin });

function EventsAdmin() {
  const { data } = useSuspenseQuery(eventsQuery);
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [draft, setDraft] = useState({ title: "", description: "", event_date: today, image: "" });

  async function add() {
    if (!draft.title.trim()) return;
    const { error } = await supabase.from("events").insert({ ...draft, image: draft.image || null });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setDraft({ title: "", description: "", event_date: today, image: "" });
    qc.invalidateQueries({ queryKey: ["site", "events"] });
  }
  async function update(row: typeof data[number], patch: Partial<typeof data[number]>) {
    const { error } = await supabase.from("events").update(patch).eq("id", row.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site", "events"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site", "events"] });
  }

  return (
    <div className="space-y-6">
      <AdminHeading title="Events" />
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> New event</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Title"><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Date"><Input type="date" value={draft.event_date} onChange={(e) => setDraft({ ...draft, event_date: e.target.value })} /></Field>
            <Field label="Image key"><Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} /></Field>
          </div>
          <Field label="Description"><Textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          <Button onClick={add}>Add</Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {data.map((row) => (
          <Card key={row.id}>
            <CardContent className="p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-[1fr,160px,1fr,auto] sm:items-end">
                <Field label="Title"><Input defaultValue={row.title} onBlur={(e) => e.target.value !== row.title && update(row, { title: e.target.value })} /></Field>
                <Field label="Date"><Input type="date" defaultValue={row.event_date.slice(0, 10)} onBlur={(e) => update(row, { event_date: e.target.value })} /></Field>
                <Field label="Image key"><Input defaultValue={row.image ?? ""} onBlur={(e) => update(row, { image: e.target.value || null })} /></Field>
                <Button variant="destructive" size="icon" onClick={() => remove(row.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <Field label="Description"><Textarea rows={2} defaultValue={row.description} onBlur={(e) => e.target.value !== row.description && update(row, { description: e.target.value })} /></Field>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
