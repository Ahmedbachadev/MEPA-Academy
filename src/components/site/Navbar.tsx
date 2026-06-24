import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "./Logo";
import { settingsQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";

const links = [
  { href: "#home", label: "Home" },
  { href: "#vision", label: "Vision & Mission" },
  { href: "#about", label: "About" },
  { href: "#activities", label: "Activities" },
  { href: "#events", label: "Seminars" },
  { href: "#courses", label: "Courses" },
  { href: "#campus", label: "Campus" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { data: settings } = useQuery(settingsQuery);
  const logoSrc = settings?.logo_url ? resolveImage(settings.logo_url) : undefined;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-md shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <a href="#home" className="shrink-0" aria-label="MEPA home">
          <Logo src={logoSrc} />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-active={active === l.href.slice(1)}
              className="link-underline text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-blue transition-transform hover:-translate-y-0.5 hover:shadow-elevated md:inline-block"
          >
            Enroll Now
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col py-3" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gradient-brand px-5 py-2.5 text-center text-sm font-semibold text-white shadow-blue"
            >
              Enroll Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
