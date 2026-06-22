import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { galleryQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { SectionHeading } from "./VisionMission";

export function Campus() {
  const { data } = useSuspenseQuery(galleryQuery);
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="campus" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Explore"
          title="Our Campus"
          description="A modern, inspiring environment built for learning, discovery, and community."
        />
        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] md:grid-cols-4">
          {data.map((g, i) => {
            const src = resolveImage(g.image);
            // Asymmetric tile sizes for a magazine feel
            const span = i % 5 === 0 ? "md:col-span-2 md:row-span-2" : "";
            return (
              <motion.button
                key={g.id}
                type="button"
                onClick={() => setLightbox(src)}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
                className={`group relative overflow-hidden rounded-2xl border border-border shadow-card ${span}`}
                aria-label={g.caption ?? "Campus photo"}
              >
                <img
                  src={src}
                  alt={g.caption ?? "MEPA campus"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {g.caption && (
                  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {g.caption}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-6"
          >
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              src={lightbox}
              alt="Campus enlarged"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-elevated"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
