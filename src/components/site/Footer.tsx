import { useSuspenseQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { settingsQuery } from "@/lib/site-queries";
import { Logo } from "./Logo";

const quickLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#courses", label: "Courses" },
  { href: "#activities", label: "Activities" },
  { href: "#events", label: "Seminars" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const { data: s } = useSuspenseQuery(settingsQuery);

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="[&_*]:!text-white">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Modern Educational Proficiency Academy — empowering students with knowledge, character,
            and proficiency for a global future.
          </p>
          <div className="mt-5 flex gap-2">
            {s?.facebook && <SocialLink href={s.facebook} icon={Facebook} label="Facebook" />}
            {s?.instagram && <SocialLink href={s.instagram} icon={Instagram} label="Instagram" />}
            {s?.linkedin && <SocialLink href={s.linkedin} icon={Linkedin} label="LinkedIn" />}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-background">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-background">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-background/70">
            {s?.address && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {s.address}
              </li>
            )}
            {s?.phone && (
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {s.phone}
              </li>
            )}
            {s?.email && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                {s.email}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-background">Newsletter</h4>
          <p className="mt-4 text-sm text-background/70">
            Stay updated with admissions news, events, and academy highlights.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex overflow-hidden rounded-full border border-white/15 bg-white/5"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button className="bg-brand-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-red/90">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-background/60 sm:flex-row">
          <span>{s?.footer_text ?? "© MEPA Academy"}</span>
          <span>Modern Educational Proficiency Academy</span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-brand-red hover:bg-brand-red"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
