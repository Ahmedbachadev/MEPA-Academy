import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";
import { Link, useRouterState } from "@tanstack/react-router";

// Removed Campus link and configured internal page routing vs hash anchors
const links = [
  { href: "/#home", hashId: "home", label: "Home" },
  { href: "/#vision", hashId: "vision", label: "Vision & Mission" },
  { href: "/#about", hashId: "about", label: "About" },
  { href: "/#activities", hashId: "activities", label: "Activities" },
  { href: "/#events", hashId: "events", label: "Seminars" },
  { href: "/#courses", hashId: "courses", label: "Courses" },
  { href: "/staff", type: "route", label: "Our Staff" }, // Dynamic page route integration
  { href: "/#contact", hashId: "contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  
  const { data: settings } = useQuery(settingsQuery);
  const logoSrc = settings?.logo_url ? resolveImage(settings.logo_url) : undefined;
  
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);

      // Only track scroll hashes if the user is physically on the landing page
      if (currentPath !== "/") return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (const link of links) {
        if (link.type === "route") continue;
        const id = link.hashId;
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActive(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentPath]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-md shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4 md:h-24">
        
        {/* Dynamic Logo Wrapper Link */}
        <Link to="/" className="group shrink-0 block" aria-label="Home">
          <div className="flex h-16 w-56 items-center justify-start overflow-hidden md:h-22 md:w-72">
            {logoSrc ? (
              <img 
                src={logoSrc} 
                alt="Logo" 
                className="h-full w-full object-contain object-left transition-transform duration-200 group-hover:scale-102 will-change-transform"
              />
            ) : (
              <div className="h-full w-full bg-muted animate-pulse rounded-md" />
            )}
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((l) => (
            l.type === "route" ? (
              <Link
                key={l.href}
                to={l.href as "/"}
                className={`link-underline text-sm font-medium transition-colors hover:text-foreground ${
                  currentPath === l.href ? "text-primary" : "text-foreground/80"
                }`}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                data-active={currentPath === "/" && active === l.hashId}
                className="link-underline text-sm font-medium text-foreground/80 transition-colors hover:text-foreground data-[active=true]:text-primary"
              >
                {l.label}
              </a>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/#contact"
            className="hidden rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-blue transition-transform hover:-translate-y-0.5 hover:shadow-elevated md:inline-block will-change-transform"
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
              l.type === "route" ? (
                <Link
                  key={l.href}
                  to={l.href as "/"}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-2 py-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                    currentPath === l.href ? "bg-muted text-primary" : "text-foreground/80"
                  }`}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </a>
              )
            ))}
            <a
              href="/#contact"
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