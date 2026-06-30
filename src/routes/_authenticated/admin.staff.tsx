import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { staffQuery } from "@/lib/site-queries";
import { AdminHeading, Field } from "@/components/admin/ui";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/staff")({ component: StaffAdmin });

type GroupType = "CEO" | "English courses staff" | "Computer courses staff";

function StaffAdmin() {
  const { data } = useSuspenseQuery(staffQuery);
  const qc = useQueryClient();
  
  const [tagInput, setTagInput] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    group_type: "English courses staff" as GroupType,
    bio: "",
    image: null as string | null,
    tags: [] as string[],
    sort_order: (data.length || 0) + 1,
  });

  function addTag() {
    if (!tagInput.trim()) return;
    if (!draft.tags.includes(tagInput.trim())) {
      setDraft({ ...draft, tags: [...draft.tags, tagInput.trim()] });
    }
    setTagInput("");
  }

  function removeTag(tagToRemove: string) {
    setDraft({ ...draft, tags: draft.tags.filter((t) => t !== tagToRemove) });
  }

  async function add() {
    if (!draft.name.trim() || !draft.bio.trim()) {
      toast.error("Name and Bio are required fields!");
      return;
    }
    const { error } = await supabase.from("staff" as any).insert({
      name: draft.name,
      group_type: draft.group_type,
      bio: draft.bio,
      image: draft.image,
      tags: draft.tags,
      sort_order: draft.sort_order,
    } as any);
    if (error) { toast.error(error.message); return; }
    toast.success("Staff member added successfully");
    setDraft({ name: "", group_type: "English courses staff", bio: "", image: null, tags: [], sort_order: draft.sort_order + 1 });
    qc.invalidateQueries({ queryKey: ["site", "staff"] });
  }

  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("staff" as any).update(patch as never).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["site", "staff"] });
  }

  async function remove(id: string) {
    if (!confirm("Remove this staff member?")) return;
    const { error } = await supabase.from("staff" as any).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["site", "staff"] });
  }

  return (
    <div className="space-y-6">
      <AdminHeading title="Manage Staff" />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="text-sm font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add Staff Member</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Name"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="Group Category">
              <Select value={draft.group_type} onValueChange={(v: GroupType) => setDraft({ ...draft, group_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="English courses staff">English Courses Staff</SelectItem>
                  <SelectItem value="Computer courses staff">Computer Courses Staff</SelectItem>
                  <SelectItem value="Mentorship">Mentorship</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Sort Order"><Input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: +e.target.value })} /></Field>
          </div>
          
          <Field label="Short Bio"><Textarea rows={2} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} /></Field>
          
          <Field label="Tags (What they teach / Skill focus)">
            <div className="flex gap-2 mb-2">
              <Input value={tagInput} placeholder="e.g., IELTS, Full Stack, Python" onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
              <Button type="button" onClick={addTag} variant="secondary">Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[24px]">
              {draft.tags.map(t => (
                <Badge key={t} variant="secondary" className="gap-1">
                  {t} <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(t)} />
                </Badge>
              ))}
            </div>
          </Field>

          <ImagePicker label="Profile Image" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
          <Button onClick={add} className="mt-2">Save Staff Member</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {data.map((row) => (
          <StaffRow key={row.id} row={row} onUpdate={update} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}

function StaffRow({
  row,
  onUpdate,
  onRemove,
}: {
  row: any;
  onUpdate: (id: string, patch: Record<string, unknown>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [image, setImage] = useState<string | null>(row.image);
  const [tagValue, setTagValue] = useState("");
  const currentTags = Array.isArray(row.tags) ? row.tags : [];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr,1.5fr,100px,auto] sm:items-end">
          <Field label="Name"><Input defaultValue={row.name} onBlur={(e) => e.target.value !== row.name && onUpdate(row.id, { name: e.target.value })} /></Field>
          <Field label="Group Category">
            <Select defaultValue={row.group_type} onValueChange={(v) => onUpdate(row.id, { group_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CEO">CEO</SelectItem>
                <SelectItem value="English courses staff">English Courses Staff</SelectItem>
                <SelectItem value="Computer courses staff">Computer Courses Staff</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Order"><Input type="number" defaultValue={row.sort_order} onBlur={(e) => +e.target.value !== row.sort_order && onUpdate(row.id, { sort_order: +e.target.value })} /></Field>
          <Button variant="destructive" size="icon" onClick={() => onRemove(row.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
        
        <Field label="Short Bio"><Textarea rows={2} defaultValue={row.bio} onBlur={(e) => e.target.value !== row.bio && onUpdate(row.id, { bio: e.target.value })} /></Field>
        
        <Field label="Tags">
          <div className="flex gap-2 mb-2">
            <Input value={tagValue} placeholder="Add new tag..." onChange={(e) => setTagValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), !currentTags.includes(tagValue.trim()) && onUpdate(row.id, { tags: [...currentTags, tagValue.trim()] }), setTagValue(""))} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentTags.map((t: string) => (
              <Badge key={t} variant="outline" className="gap-1">
                {t} <X className="h-3 w-3 cursor-pointer" onClick={() => onUpdate(row.id, { tags: currentTags.filter((tag: string) => tag !== t) })} />
              </Badge>
            ))}
          </div>
        </Field>

        <ImagePicker
          label="Profile Image"
          value={image}
          onChange={(v) => {
            setImage(v);
            onUpdate(row.id, { image: v });
          }}
        />
      </CardContent>
    </Card>
  );
}