import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Award, Users, BookOpen } from "lucide-react";
import { heroQuery } from "@/lib/site-queries";
import { heroCampus } from "@/lib/site-images";

export function Hero() {
  const { data } = useSuspenseQuery(heroQuery);

  const stats = [
    { icon: Users, label: "Students Trained", value: data?.stat_students ?? 0, suffix: "+" },
    { icon: BookOpen, label: "Courses Offered", value: data?.stat_courses ?? 0, suffix: "+" },
    { icon: GraduationCap, label: "Seminars Held", value: data?.stat_seminars ?? 0, suffix: "+" },
    { icon: Award, label: "Success Rate", value: data?.stat_success_rate ?? 0, suffix: "%" },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-hero pt-28 md:pt-36"
    >
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />

      <div className="container-page relative grid items-center gap-12 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-brand-red" />
            Admissions Open · 2026 Intake
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-balance text-4xl font-bold leading-[1.05] text-foreground md:text-5xl lg:text-6xl"
          >
            {data?.title ?? "Shaping Tomorrow's Leaders"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {data?.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href={data?.button_one_href ?? "#contact"}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-blue transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              {data?.button_one_label ?? "Apply Now"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={data?.button_two_href ?? "#contact"}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-red hover:text-brand-red"
            >
              {data?.button_two_label ?? "Contact Us"}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card/80 p-4 shadow-card backdrop-blur"
              >
                <s.icon className="h-5 w-5 text-brand-blue" />
                <div className="mt-3 font-display text-2xl font-bold text-foreground">
                  {s.value.toLocaleString()}
                  {s.suffix}
                </div>
                <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-brand opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border shadow-elevated">
            <img
              src={heroCampus}
              alt="MEPA Academy modern campus"
              width={1600}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl bg-white/90 p-3 text-foreground shadow-card backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Accredited Excellence</div>
                <div className="text-xs text-muted-foreground">Recognized academic programs</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
