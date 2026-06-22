import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/site-queries";
import { SectionHeading } from "./VisionMission";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

export function Contact() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") ?? "",
      message: fd.get("message"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    const { error: insErr } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (insErr) {
      setError("Could not send. Please try again.");
      return;
    }
    setSubmitted(true);
    (e.target as HTMLFormElement).reset();
  }

  const items = [
    { icon: MapPin, label: "Address", value: settings?.address },
    { icon: Phone, label: "Phone", value: settings?.phone },
    { icon: Mail, label: "Email", value: settings?.email },
    { icon: Clock, label: "Working Hours", value: settings?.working_hours },
  ];

  return (
    <section id="contact" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Contact MEPA"
          description="Have a question, want to enroll, or visit our campus? Send a message and we'll respond shortly."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {items.map((it) => (
              <div
                key={it.label}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <it.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {it.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground">{it.value ?? "—"}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-elevated md:p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">Message sent</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Thank you for reaching out. Our admissions team will respond within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" name="name" required placeholder="Jane Doe" />
                  <Field label="Email" name="email" type="email" required placeholder="you@email.com" />
                </div>
                <div className="mt-4">
                  <Field label="Phone (optional)" name="phone" placeholder="+1 555 000 1234" />
                </div>
                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/15"
                  />
                </div>
                {error && (
                  <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-blue transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {submitting ? "Sending..." : "Send Message"}
                  <Send className="h-4 w-4" />
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/15"
      />
    </div>
  );
}
