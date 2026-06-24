import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImage } from "@/lib/site-images";

export interface DetailItem {
  title: string;
  description?: string | null;
  details?: string | null;
  image?: string | null;
  gallery?: string[] | null;
  meta?: { label: string; value: string }[];
}

export function DetailDialog({
  item,
  onClose,
}: {
  item: DetailItem | null;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);

  const allImages = item
    ? [item.image, ...(item.gallery ?? [])].filter((x): x is string => !!x)
    : [];

  useEffect(() => {
    setActive(0);
  }, [item]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!item) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % Math.max(allImages.length, 1));
      if (e.key === "ArrowLeft")
        setActive((i) => (i - 1 + Math.max(allImages.length, 1)) % Math.max(allImages.length, 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, allImages.length, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-3 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-elevated md:grid-cols-[1.1fr_1fr]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative bg-black">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={resolveImage(allImages[active])}
                    alt={item.title}
                    className="h-64 w-full object-cover md:h-full md:max-h-[92vh]"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActive((i) => (i - 1 + allImages.length) % allImages.length)
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActive((i) => (i + 1) % allImages.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                        aria-label="Next"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                        {allImages.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-label={`Image ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                              i === active ? "w-6 bg-white" : "w-1.5 bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-64 items-center justify-center text-xs text-white/60 md:h-full">
                  No images
                </div>
              )}
            </div>

            <div className="flex max-h-[60vh] flex-col overflow-y-auto p-6 md:max-h-[92vh] md:p-8">
              <h3 className="pr-10 text-2xl font-bold text-foreground">{item.title}</h3>
              {item.meta && item.meta.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.meta.map((m) => (
                    <span
                      key={m.label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue"
                    >
                      <span className="opacity-70">{m.label}:</span> {m.value}
                    </span>
                  ))}
                </div>
              )}
              {item.description && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
              {item.details && (
                <div className="mt-5 whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {item.details}
                </div>
              )}
              <a
                href="#contact"
                onClick={onClose}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-blue transition-transform hover:-translate-y-0.5"
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
