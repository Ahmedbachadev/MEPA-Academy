import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { visionMissionQuery } from "@/lib/site-queries";
import { AdminHeading, Field, SaveButton, useSaver } from "@/components/admin/ui";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/vision-mission")({ component: VMAdmin });

function VMAdmin() {
  const { data } = useSuspenseQuery(visionMissionQuery);
  const { saving, save } = useSaver();
  const [form, setForm] = useState(data!);
  useEffect(() => setForm(data!), [data]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(
          async () => await supabase.from("vision_mission").update({ vision: form.vision, mission: form.mission }).eq("id", form.id),
          ["site", "vision_mission"]
        );
      }}
      className="space-y-5"
    >
      <AdminHeading title="Vision & Mission" />
      <Field label="Vision"><Textarea rows={4} value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} /></Field>
      <Field label="Mission"><Textarea rows={4} value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} /></Field>
      <SaveButton saving={saving} />
    </form>
  );
}
