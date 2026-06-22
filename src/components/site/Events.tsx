import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { eventsQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { SectionHeading } from "./VisionMission";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

export function Events() {
  const { data } = useSuspenseQuery(eventsQuery);

  return (
    <section id="events" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Upcoming"
          title="Sessions & Seminars"
          description="Flagship events featuring industry leaders, researchers, and changemakers."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((e, i) => (
            <motion.article
              key={e.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={resolveImage(e.image)}
                  alt={e.title}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-red shadow-card backdrop-blur">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(e.event_date)}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-foreground">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
                <a
                  href="#contact"
                  className="mt-5 inline-flex w-fit items-center text-sm font-semibold text-brand-blue link-underline"
                >
                  Reserve seat
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
