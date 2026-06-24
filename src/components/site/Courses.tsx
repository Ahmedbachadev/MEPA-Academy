import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, Wallet, ArrowRight } from "lucide-react";
import { coursesQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { SectionHeading } from "./VisionMission";
import { DetailDialog, type DetailItem } from "./DetailDialog";

export function Courses() {
  const { data } = useSuspenseQuery(coursesQuery);
  const [open, setOpen] = useState<DetailItem | null>(null);

  return (
    <section id="courses" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Programs"
          title="Our Courses"
          description="Rigorous, modern curricula across sciences, humanities, business, and the arts."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((c, i) => (
            <motion.button
              key={c.id}
              type="button"
              onClick={() =>
                setOpen({
                  title: c.title,
                  description: c.description,
                  details: (c as { details?: string | null }).details ?? null,
                  image: c.image,
                  gallery: ((c as { gallery?: unknown }).gallery as string[]) ?? [],
                  meta: [
                    { label: "Duration", value: c.duration },
                    { label: "Fee", value: c.fee },
                  ],
                })
              }
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group text-left flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={resolveImage(c.image)}
                  alt={c.title}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
                <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-blue" />
                    {c.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-brand-red" />
                    {c.fee}
                  </span>
                </div>
                <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-blue">
                  View details
                  <ArrowRight className="h-4 w-4" />
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
