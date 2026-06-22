import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/site-queries";
import { AdminHeading, Field, SaveButton, useSaver } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsAdmin });

function SettingsAdmin() {
  const { data } = useSuspenseQuery(settingsQuery);
  const { saving, save } = useSaver();
  const [form, setForm] = useState(data!);
  useEffect(() => setForm(data!), [data]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(
          async () => await supabase.from("settings").update({
            address: form.address, email: form.email, phone: form.phone,
            working_hours: form.working_hours, facebook: form.facebook,
            instagram: form.instagram, linkedin: form.linkedin, footer_text: form.footer_text,
          }).eq("id", form.id),
          ["site", "settings"]
        );
      }}
      className="space-y-5"
    >
      <AdminHeading title="Site Settings" description="Contact info, social links, and footer." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email"><Input value={form.email ?? ""} onChange={set("email")} /></Field>
        <Field label="Phone"><Input value={form.phone ?? ""} onChange={set("phone")} /></Field>
        <Field label="Address"><Input value={form.address ?? ""} onChange={set("address")} /></Field>
        <Field label="Working hours"><Input value={form.working_hours ?? ""} onChange={set("working_hours")} /></Field>
        <Field label="Facebook URL"><Input value={form.facebook ?? ""} onChange={set("facebook")} /></Field>
        <Field label="Instagram URL"><Input value={form.instagram ?? ""} onChange={set("instagram")} /></Field>
        <Field label="LinkedIn URL"><Input value={form.linkedin ?? ""} onChange={set("linkedin")} /></Field>
      </div>
      <Field label="Footer text"><Textarea rows={2} value={form.footer_text ?? ""} onChange={set("footer_text")} /></Field>
      <SaveButton saving={saving} />
    </form>
  );
}
