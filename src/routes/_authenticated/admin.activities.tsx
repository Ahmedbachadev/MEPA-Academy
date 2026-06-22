import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { activitiesQuery } from "@/lib/site-queries";
import { AdminHeading, Field } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/activities")({ component: ActivitiesAdmin });

type Row = { id?: string; title: string; description: string; image: string | null; sort_order: number };

function ActivitiesAdmin() {
  const { data } = useSuspenseQuery(activitiesQuery);
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Row>({ title: "", description: "", image: "", sort_order: (data.length || 0) + 1 });

  async function add() {
    if (!draft.title.trim()) return;
    const { error } = await supabase.from("activities").insert({ ...draft, image: draft.image || null });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setDraft({ title: "", description: "", image: "", sort_order: draft.sort_order + 1 });
    qc.invalidateQueries({ queryKey: ["site", "activities"] });
  }
  async function update(row: typeof data[number], patch: Partial<Row>) {
    const { error } = await supabase.from("activities").update(patch).eq("id", row.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site", "activities"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this activity?")) return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["site", "activities"] });
  }

  return (
    <div className="space-y-6">
      <AdminHeading title="Activities" />
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> New activity</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title"><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Image key"><Input value={draft.image ?? ""} onChange={(e) => setDraft({ ...draft, image: e.target.value })} /></Field>
          </div>
          <Field label="Description"><Textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          <div className="flex items-end gap-3">
            <Field label="Sort order"><Input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: +e.target.value })} /></Field>
            <Button onClick={add}>Add</Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {data.map((row) => (
          <Card key={row.id}>
            <CardContent className="p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-[1fr,1fr,80px,auto] sm:items-end">
                <Field label="Title"><Input defaultValue={row.title} onBlur={(e) => e.target.value !== row.title && update(row, { title: e.target.value })} /></Field>
                <Field label="Image key"><Input defaultValue={row.image ?? ""} onBlur={(e) => update(row, { image: e.target.value || null })} /></Field>
                <Field label="Order"><Input type="number" defaultValue={row.sort_order} onBlur={(e) => +e.target.value !== row.sort_order && update(row, { sort_order: +e.target.value })} /></Field>
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
