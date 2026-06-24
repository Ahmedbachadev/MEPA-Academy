import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { activitiesQuery } from "@/lib/site-queries";
import { AdminHeading, Field } from "@/components/admin/ui";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { GalleryPicker } from "@/components/admin/GalleryPicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/activities")({ component: ActivitiesAdmin });

type Draft = {
  title: string;
  description: string;
  details: string;
  image: string | null;
  gallery: string[];
  sort_order: number;
};

function ActivitiesAdmin() {
  const { data } = useSuspenseQuery(activitiesQuery);
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>({
    title: "",
    description: "",
    details: "",
    image: null,
    gallery: [],
    sort_order: (data.length || 0) + 1,
  });

  async function add() {
    if (!draft.title.trim()) return;
    const { error } = await supabase.from("activities").insert({
      title: draft.title,
      description: draft.description,
      details: draft.details || null,
      image: draft.image,
      gallery: draft.gallery,
      sort_order: draft.sort_order,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Added");
    setDraft({ title: "", description: "", details: "", image: null, gallery: [], sort_order: draft.sort_order + 1 });
    qc.invalidateQueries({ queryKey: ["site", "activities"] });
  }
  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("activities").update(patch as never).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["site", "activities"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this activity?")) return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["site", "activities"] });
  }

  return (
    <div className="space-y-6">
      <AdminHeading title="Activities" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> New activity</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title"><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Sort order"><Input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: +e.target.value })} /></Field>
          </div>
          <Field label="Short description"><Textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          <Field label="Full details (shown in popup)"><Textarea rows={4} value={draft.details} onChange={(e) => setDraft({ ...draft, details: e.target.value })} /></Field>
          <ImagePicker label="Cover image" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
          <GalleryPicker value={draft.gallery} onChange={(v) => setDraft({ ...draft, gallery: v })} />
          <Button onClick={add}>Add activity</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {data.map((row) => (
          <ActivityRow key={row.id} row={row} onUpdate={update} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}

type ActivityRecord = Record<string, unknown> & {
  id: string;
  title: string;
  description: string;
  image: string | null;
  sort_order: number;
};

function ActivityRow({
  row,
  onUpdate,
  onRemove,
}: {
  row: ActivityRecord;
  onUpdate: (id: string, patch: Record<string, unknown>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [image, setImage] = useState<string | null>(row.image);
  const [gallery, setGallery] = useState<string[]>(
    Array.isArray(row.gallery) ? (row.gallery as string[]) : [],
  );

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr,100px,auto] sm:items-end">
          <Field label="Title"><Input defaultValue={row.title} onBlur={(e) => e.target.value !== row.title && onUpdate(row.id, { title: e.target.value })} /></Field>
          <Field label="Order"><Input type="number" defaultValue={row.sort_order} onBlur={(e) => +e.target.value !== row.sort_order && onUpdate(row.id, { sort_order: +e.target.value })} /></Field>
          <Button variant="destructive" size="icon" onClick={() => onRemove(row.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
        <Field label="Short description"><Textarea rows={2} defaultValue={row.description} onBlur={(e) => e.target.value !== row.description && onUpdate(row.id, { description: e.target.value })} /></Field>
        <Field label="Full details (shown in popup)"><Textarea rows={4} defaultValue={(row as { details?: string | null }).details ?? ""} onBlur={(e) => onUpdate(row.id, { details: e.target.value || null })} /></Field>
        <ImagePicker
          label="Cover image"
          value={image}
          onChange={(v) => {
            setImage(v);
            onUpdate(row.id, { image: v });
          }}
        />
        <GalleryPicker
          value={gallery}
          onChange={(v) => {
            setGallery(v);
            onUpdate(row.id, { gallery: v });
          }}
        />
      </CardContent>
    </Card>
  );
}
