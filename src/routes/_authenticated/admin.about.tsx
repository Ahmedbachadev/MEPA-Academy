import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { aboutQuery } from "@/lib/site-queries";
import { AdminHeading, Field, SaveButton, useSaver } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/about")({ component: AboutAdmin });

function AboutAdmin() {
  const { data } = useSuspenseQuery(aboutQuery);
  const { saving, save } = useSaver();
  const [form, setForm] = useState(data!);
  useEffect(() => setForm(data!), [data]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(
          async () => await supabase.from("about_us").update({ content: form.content, image: form.image }).eq("id", form.id),
          ["site", "about"]
        );
      }}
      className="space-y-5"
    >
      <AdminHeading title="About Us" />
      <Field label="Content"><Textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>
      <Field label="Image key or URL" hint="Use a key (e.g. about-classroom) or full URL">
        <Input value={form.image ?? ""} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      </Field>
      <SaveButton saving={saving} />
    </form>
  );
}
