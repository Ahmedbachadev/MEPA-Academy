import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";
import { visionMissionQuery } from "@/lib/site-queries";

export function VisionMission() {
  const { data } = useSuspenseQuery(visionMissionQuery);

  const cards = [
    {
      icon: Eye,
      title: "Our Vision",
      body: data?.vision,
      accent: "blue" as const,
    },
    {
      icon: Target,
      title: "Our Mission",
      body: data?.mission,
      accent: "red" as const,
    },
  ];

  return (
    <section id="vision" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="What Drives Us"
          title="Vision & Mission"
          description="The guiding principles behind every decision, classroom, and graduate at MEPA."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition-shadow hover:shadow-elevated md:p-10"
            >
              <div
                className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl ${
                  card.accent === "blue" ? "bg-brand-blue/15" : "bg-brand-red/15"
                }`}
              />
              <div
                className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                  card.accent === "blue"
                    ? "bg-brand-blue/10 text-brand-blue"
                    : "bg-brand-red/10 text-brand-red"
                }`}
              >
                <card.icon className="h-7 w-7" />
              </div>
              <h3 className="relative mt-6 text-2xl font-bold text-foreground">{card.title}</h3>
              <p className="relative mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-red`}
        >
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 text-balance text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-pretty text-base text-muted-foreground md:text-lg">{description}</p>
      )}
    </div>
  );
}
