import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { eventsQuery } from "@/lib/site-queries";
import { AdminHeading, Field } from "@/components/admin/ui";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { GalleryPicker } from "@/components/admin/GalleryPicker";
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
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    details: "",
    location: "",
    event_date: today,
    image: null as string | null,
    gallery: [] as string[],
  });

  async function add() {
    if (!draft.title.trim()) return;
    const { error } = await supabase.from("events").insert({
      title: draft.title,
      description: draft.description,
      details: draft.details || null,
      location: draft.location || null,
      event_date: draft.event_date,
      image: draft.image,
      gallery: draft.gallery,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Added");
    setDraft({ title: "", description: "", details: "", location: "", event_date: today, image: null, gallery: [] });
    qc.invalidateQueries({ queryKey: ["site", "events"] });
  }
  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("events").update(patch as never).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["site", "events"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["site", "events"] });
  }

  return (
    <div className="space-y-6">
      <AdminHeading title="Sessions & Seminars" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> New event</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Title"><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Date"><Input type="date" value={draft.event_date} onChange={(e) => setDraft({ ...draft, event_date: e.target.value })} /></Field>
            <Field label="Location"><Input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></Field>
          </div>
          <Field label="Short description"><Textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
          <Field label="Full details (shown in popup)"><Textarea rows={4} value={draft.details} onChange={(e) => setDraft({ ...draft, details: e.target.value })} /></Field>
          <ImagePicker label="Cover image" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
          <GalleryPicker value={draft.gallery} onChange={(v) => setDraft({ ...draft, gallery: v })} />
          <Button onClick={add}>Add event</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {data.map((row) => (
          <EventRow key={row.id} row={row} onUpdate={update} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}

type EventRecord = Record<string, unknown> & {
  id: string;
  title: string;
  description: string;
  event_date: string;
  image: string | null;
};

function EventRow({
  row,
  onUpdate,
  onRemove,
}: {
  row: EventRecord;
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
        <div className="grid gap-3 sm:grid-cols-[1fr,160px,1fr,auto] sm:items-end">
          <Field label="Title"><Input defaultValue={row.title} onBlur={(e) => e.target.value !== row.title && onUpdate(row.id, { title: e.target.value })} /></Field>
          <Field label="Date"><Input type="date" defaultValue={row.event_date.slice(0, 10)} onBlur={(e) => onUpdate(row.id, { event_date: e.target.value })} /></Field>
          <Field label="Location"><Input defaultValue={(row as { location?: string | null }).location ?? ""} onBlur={(e) => onUpdate(row.id, { location: e.target.value || null })} /></Field>
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
