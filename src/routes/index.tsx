import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  heroQuery,
  visionMissionQuery,
  aboutQuery,
  activitiesQuery,
  eventsQuery,
  coursesQuery,
  galleryQuery,
  settingsQuery,
} from "@/lib/site-queries";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { VisionMission } from "@/components/site/VisionMission";
import { About } from "@/components/site/About";
import { Activities } from "@/components/site/Activities";
import { Events } from "@/components/site/Events";
import { Courses } from "@/components/site/Courses";
import { Campus } from "@/components/site/Campus";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MEPA — Modern Educational Proficiency Academy" },
      {
        name: "description",
        content:
          "MEPA is a premier modern academy delivering world-class education, innovative programs, and a vibrant student experience.",
      },
      { property: "og:title", content: "MEPA — Modern Educational Proficiency Academy" },
      {
        property: "og:description",
        content:
          "Explore courses, seminars, and campus life at MEPA — Modern Educational Proficiency Academy.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(heroQuery);
    context.queryClient.ensureQueryData(visionMissionQuery);
    context.queryClient.ensureQueryData(aboutQuery);
    context.queryClient.ensureQueryData(activitiesQuery);
    context.queryClient.ensureQueryData(eventsQuery);
    context.queryClient.ensureQueryData(coursesQuery);
    context.queryClient.ensureQueryData(galleryQuery);
    context.queryClient.ensureQueryData(settingsQuery);
  },
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Retry
        </button>
      </div>
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Suspense fallback={<SectionFallback className="min-h-[80vh]" />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <VisionMission />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Activities />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Events />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Courses />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Campus />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

function SectionFallback({ className = "" }: { className?: string }) {
  return <div className={`flex items-center justify-center py-24 text-muted-foreground ${className}`}>Loading…</div>;
}
