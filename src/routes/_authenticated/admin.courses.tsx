import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { coursesQuery } from "@/lib/site-queries";
import { AdminHeading, Field } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/courses")({ component: CoursesAdmin });

function CoursesAdmin() {
  const { data } = useSuspenseQuery(coursesQuery);
  const qc = useQueryClient();
  const [draft, setDraft] = useState({ title: "", description: "", duration: "", fee: "", image: "", sort_order: (data.length || 0) + 1 });

  async function add() {
    if (!draft.title.trim()) return;
    const { error } = await supabase.from("courses").insert({ ...draft, image: draft.image || null });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setDraft({ title: "", description: "", duration: "", fee: "", image: "", sort_order: draft.sort_order + 1 });
    qc.invalidateQueries({ queryKey: ["site", "courses"] });
  }
  async function update(row: typeof data[number], patch: Partial<typeof data[number]>) {
    const { error } = await supabase.from("courses").update(patch).eq("id", row.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site", "courses"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this course?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site", "courses"] });
  }

  return (
    <div className="space-y-6">
      <AdminHeading title="Courses" />
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> New course</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title"><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Image key"><Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} /></Field>
            <Field label="Duration"><Input value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} /></Field>
            <Field label="Fee"><Input value={draft.fee} onChange={(e) => setDraft({ ...draft, fee: e.target.value })} /></Field>
          </div>
          <Field label="Description"><Textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          <div className="flex items-end gap-3">
            <Field label="Sort"><Input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: +e.target.value })} /></Field>
            <Button onClick={add}>Add</Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {data.map((row) => (
          <Card key={row.id}>
            <CardContent className="p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-4 sm:items-end">
                <Field label="Title"><Input defaultValue={row.title} onBlur={(e) => e.target.value !== row.title && update(row, { title: e.target.value })} /></Field>
                <Field label="Duration"><Input defaultValue={row.duration} onBlur={(e) => update(row, { duration: e.target.value })} /></Field>
                <Field label="Fee"><Input defaultValue={row.fee} onBlur={(e) => update(row, { fee: e.target.value })} /></Field>
                <Field label="Image key"><Input defaultValue={row.image ?? ""} onBlur={(e) => update(row, { image: e.target.value || null })} /></Field>
              </div>
              <Field label="Description"><Textarea rows={2} defaultValue={row.description} onBlur={(e) => e.target.value !== row.description && update(row, { description: e.target.value })} /></Field>
              <div className="flex items-center justify-between">
                <Field label="Sort"><Input type="number" defaultValue={row.sort_order} onBlur={(e) => +e.target.value !== row.sort_order && update(row, { sort_order: +e.target.value })} /></Field>
                <Button variant="destructive" size="icon" onClick={() => remove(row.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
