import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { activitiesQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { SectionHeading } from "./VisionMission";
import { DetailDialog, type DetailItem } from "./DetailDialog";

export function Activities() {
  const { data } = useSuspenseQuery(activitiesQuery);
  const [open, setOpen] = useState<DetailItem | null>(null);

  return (
    <section id="activities" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Beyond the Classroom"
          title="Activities & Student Life"
          description="A vibrant program of workshops, competitions, and clubs that develops well-rounded leaders."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((a, i) => (
            <motion.button
              key={a.id}
              type="button"
              onClick={() =>
                setOpen({
                  title: a.title,
                  description: a.description,
                  details: (a as { details?: string | null }).details ?? null,
                  image: a.image,
                  gallery: ((a as { gallery?: unknown }).gallery as string[]) ?? [],
                })
              }
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group text-left overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={resolveImage(a.image)}
                  alt={a.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                <span className="mt-3 inline-block text-xs font-semibold text-brand-blue">
                  View details →
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <DetailDialog item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
