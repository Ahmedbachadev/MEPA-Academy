import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { aboutQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { SectionHeading } from "./VisionMission";

const reasons = [
  "Expert faculty with global teaching experience",
  "Modern campus and state-of-the-art labs",
  "Holistic curriculum balancing academics and life skills",
  "Personalized career mentorship & university prep",
];

export function About() {
  const { data } = useSuspenseQuery(aboutQuery);
  const imgSrc = resolveImage(data?.image ?? null);

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-brand opacity-15 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated">
            <img
              src={imgSrc}
              alt="MEPA students learning together"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-elevated sm:block">
            <div className="font-display text-3xl font-bold text-brand-red">2+</div>
            <div className="text-xs font-medium text-muted-foreground">Years of Excellence</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            eyebrow="About MEPA"
            title="A modern academy built on academic rigor"
            align="left"
          />
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {data?.content}
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-brand-blue"
          >
            Talk to Admissions
          </a>
        </motion.div>
      </div>
    </section>
  );
}
