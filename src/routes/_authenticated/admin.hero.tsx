import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { heroQuery } from "@/lib/site-queries";
import { AdminHeading, Field, SaveButton, useSaver } from "@/components/admin/ui";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/hero")({ component: HeroAdmin });

type HeroForm = {
  id: string;
  title: string;
  subtitle: string;
  button_one_label: string;
  button_one_href: string;
  button_two_label: string;
  button_two_href: string;
  stat_students: number;
  stat_courses: number;
  stat_seminars: number;
  stat_success_rate: number;
  image: string | null;
};

function HeroAdmin() {
  const { data } = useSuspenseQuery(heroQuery);
  const { saving, save } = useSaver();
  const [form, setForm] = useState<HeroForm>(data as unknown as HeroForm);
  useEffect(() => setForm(data as unknown as HeroForm), [data]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(
          async () =>
            await supabase
              .from("hero_section")
              .update({
                title: form.title,
                subtitle: form.subtitle,
                button_one_label: form.button_one_label,
                button_one_href: form.button_one_href,
                button_two_label: form.button_two_label,
                button_two_href: form.button_two_href,
                stat_students: form.stat_students,
                stat_courses: form.stat_courses,
                stat_seminars: form.stat_seminars,
                stat_success_rate: form.stat_success_rate,
                image: form.image,
              })
              .eq("id", form.id),
          ["site", "hero"],
        );
      }}
      className="space-y-5"
    >
      <AdminHeading title="Hero Section" description="Headline, subtitle, hero image, CTAs and stats." />
      <ImagePicker label="Hero image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
      <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
      <Field label="Subtitle"><Textarea rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary button label"><Input value={form.button_one_label} onChange={(e) => setForm({ ...form, button_one_label: e.target.value })} /></Field>
        <Field label="Primary button link"><Input value={form.button_one_href} onChange={(e) => setForm({ ...form, button_one_href: e.target.value })} /></Field>
        <Field label="Secondary button label"><Input value={form.button_two_label} onChange={(e) => setForm({ ...form, button_two_label: e.target.value })} /></Field>
        <Field label="Secondary button link"><Input value={form.button_two_href} onChange={(e) => setForm({ ...form, button_two_href: e.target.value })} /></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Students"><Input type="number" value={form.stat_students} onChange={(e) => setForm({ ...form, stat_students: +e.target.value })} /></Field>
        <Field label="Courses"><Input type="number" value={form.stat_courses} onChange={(e) => setForm({ ...form, stat_courses: +e.target.value })} /></Field>
        <Field label="Seminars"><Input type="number" value={form.stat_seminars} onChange={(e) => setForm({ ...form, stat_seminars: +e.target.value })} /></Field>
        <Field label="Success %"><Input type="number" value={form.stat_success_rate} onChange={(e) => setForm({ ...form, stat_success_rate: +e.target.value })} /></Field>
      </div>
      <SaveButton saving={saving} />
    </form>
  );
}
