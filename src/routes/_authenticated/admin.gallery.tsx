import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { galleryQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { AdminHeading, Field } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/gallery")({ component: GalleryAdmin });

function GalleryAdmin() {
  const { data } = useSuspenseQuery(galleryQuery);
  const qc = useQueryClient();
  const [draft, setDraft] = useState({ image: "", caption: "", sort_order: (data.length || 0) + 1 });

  async function add() {
    if (!draft.image.trim()) return toast.error("Image key required");
    const { error } = await supabase.from("campus_gallery").insert({ image: draft.image, caption: draft.caption || null, sort_order: draft.sort_order });
    if (error) return toast.error(error.message);
    toast.success("Added");
    setDraft({ image: "", caption: "", sort_order: draft.sort_order + 1 });
    qc.invalidateQueries({ queryKey: ["site", "gallery"] });
  }
  async function update(row: typeof data[number], patch: Partial<typeof data[number]>) {
    const { error } = await supabase.from("campus_gallery").update(patch).eq("id", row.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site", "gallery"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("campus_gallery").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["site", "gallery"] });
  }

  return (
    <div className="space-y-6">
      <AdminHeading title="Campus Gallery" />
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add image</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Image key/URL"><Input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} /></Field>
            <Field label="Caption"><Input value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} /></Field>
            <Field label="Sort"><Input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: +e.target.value })} /></Field>
          </div>
          <Button onClick={add}>Add</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((row) => (
          <Card key={row.id}>
            <CardContent className="p-3 space-y-2">
              <img src={resolveImage(row.image)} alt={row.caption ?? ""} className="aspect-video w-full rounded object-cover" />
              <Field label="Image key/URL"><Input defaultValue={row.image} onBlur={(e) => e.target.value !== row.image && update(row, { image: e.target.value })} /></Field>
              <Field label="Caption"><Input defaultValue={row.caption ?? ""} onBlur={(e) => update(row, { caption: e.target.value || null })} /></Field>
              <div className="flex items-end gap-2">
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
