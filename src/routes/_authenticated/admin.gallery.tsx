import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { galleryQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { AdminHeading, Field } from "@/components/admin/ui";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/gallery")({ component: GalleryAdmin });

function GalleryAdmin() {
  const { data } = useSuspenseQuery(galleryQuery);
  const qc = useQueryClient();
  const [draft, setDraft] = useState<{ image: string | null; caption: string; sort_order: number }>({
    image: null,
    caption: "",
    sort_order: (data.length || 0) + 1,
  });

  async function add() {
    if (!draft.image) return toast.error("Please choose or upload an image");
    const { error } = await supabase.from("campus_gallery").insert({
      image: draft.image,
      caption: draft.caption || null,
      sort_order: draft.sort_order,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Added");
    setDraft({ image: null, caption: "", sort_order: draft.sort_order + 1 });
    qc.invalidateQueries({ queryKey: ["site", "gallery"] });
  }
  async function update(row: (typeof data)[number], patch: Record<string, unknown>) {
    const { error } = await supabase.from("campus_gallery").update(patch as never).eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["site", "gallery"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("campus_gallery").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["site", "gallery"] });
  }

  return (
    <div className="space-y-6">
      <AdminHeading title="Campus Gallery" description="Upload campus photos from your device or paste a URL." />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add image</div>
          <ImagePicker label="Image" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
          <div className="grid gap-3 sm:grid-cols-[1fr,120px,auto] sm:items-end">
            <Field label="Caption"><Input value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} /></Field>
            <Field label="Sort"><Input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: +e.target.value })} /></Field>
            <Button onClick={add}>Add</Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((row) => (
          <GalleryRow key={row.id} row={row} onUpdate={update} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}

function GalleryRow({
  row,
  onUpdate,
  onRemove,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (row: any, patch: Record<string, unknown>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [img, setImg] = useState<string | null>(row.image);
  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <img src={resolveImage(img)} alt={row.caption ?? ""} className="aspect-video w-full rounded object-cover" />
        <ImagePicker
          label="Image"
          value={img}
          onChange={(v) => {
            setImg(v);
            if (v) onUpdate(row, { image: v });
          }}
        />
        <Field label="Caption"><Input defaultValue={row.caption ?? ""} onBlur={(e) => onUpdate(row, { caption: e.target.value || null })} /></Field>
        <div className="flex items-end gap-2">
          <Field label="Sort"><Input type="number" defaultValue={row.sort_order} onBlur={(e) => +e.target.value !== row.sort_order && onUpdate(row, { sort_order: +e.target.value })} /></Field>
          <Button variant="destructive" size="icon" onClick={() => onRemove(row.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
