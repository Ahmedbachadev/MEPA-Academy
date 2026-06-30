import { useSuspenseQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { settingsQuery } from "@/lib/site-queries";
import { resolveImage } from "@/lib/site-images";

// ==========================================
// EDIT YOUR SOCIAL MEDIA LINKS HERE:
// ==========================================
const socialMediaLinks = [
  {
    providerKey: "facebook",
    label: "Facebook",
    icon: (props: any) => <Facebook {...props} />,
    fallbackUrl: "https://share.google/yILTi3hLfkebRHJUh"
  },
  {
    providerKey: "instagram",
    label: "Instagram",
    icon: (props: any) => <Instagram {...props} />,
    fallbackUrl: "https://instagram.com"
  },
  {
    providerKey: "linkedin",
    label: "LinkedIn",
    icon: (props: any) => <Linkedin {...props} />,
    fallbackUrl: "https://linkedin.com"
  },
  {
    providerKey: "whatsapp",
    label: "WhatsApp",
    // Official Exact WhatsApp SVG Logo Path
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.428 1.978 13.96 1.957 12.01 1.957c-5.444 0-9.87 4.374-9.875 9.803-.002 1.81.474 3.578 1.38 5.148l-.992 3.623 3.719-.974zm11.367-7.393c-.315-.158-1.86-.92-2.148-1.025-.289-.105-.499-.158-.708.158-.21.315-.813 1.025-.996 1.235-.183.21-.365.236-.68.079-.315-.158-1.33-.49-2.534-1.565-.94-.84-1.573-1.876-1.756-2.191-.183-.315-.02-.485.137-.642.142-.141.315-.368.473-.553.158-.185.21-.316.315-.527.105-.211.053-.395-.026-.553-.079-.158-.708-1.71-.97-2.342-.255-.613-.515-.53-.708-.54-.183-.01-.395-.01-.606-.01-.211 0-.553.08-.842.395-.29.315-1.105 1.08-1.105 2.633 0 1.554 1.131 3.054 1.289 3.265.158.21 2.226 3.401 5.393 4.766.753.325 1.342.519 1.802.666.757.241 1.446.207 1.99.127.608-.09 1.86-.764 2.122-1.461.263-.697.263-1.29.184-1.416-.08-.125-.29-.211-.606-.369z" />
      </svg>
    ),
    fallbackUrl: "https://wa.me/923471927672"
  },
  {
    providerKey: "tiktok",
    label: "TikTok",
    // Official Exact TikTok SVG Logo Path
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.02 1.61 4.2 1.14 1.33 2.76 2.19 4.49 2.42v3.84c-1.41-.07-2.79-.56-3.96-1.35-.67-.47-1.25-1.06-1.71-1.74v7.35c0 1.1-.22 2.2-.66 3.22-.96 2.31-3.13 3.96-5.61 4.02-2.5.07-4.94-1.22-6.12-3.42-.98-1.84-1.02-4.12-.1-6 1.01-2.07 3.27-3.42 5.59-3.32.74.02 1.48.18 2.17.47v3.91c-.5-.22-1.06-.32-1.61-.31-1.31.02-2.54.85-3.03 2.06-.61 1.45-.03 3.19 1.34 3.96.99.57 2.25.45 3.11-.31.42-.36.67-.88.72-1.44.02-1.43.01-11.88.01-11.88z" />
      </svg>
    ),
    fallbackUrl: "https://www.tiktok.com/discover/mepa-academy?is_from_webapp=1&sender_device=pc"
  }
];

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
  const logoSrc = s?.logo_url ? resolveImage(s.logo_url) : undefined;

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {/* Brand Identity Layout: Icon + Customized Text */}
          <a href="#home" className="flex items-center gap-3 group" aria-label="MEPA Academy Home">
            {logoSrc && (
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white p-1 shadow-sm transition-transform duration-200 group-hover:scale-105">
<img src="src/assets/favicon.png" alt="Favicon Brand" className="h-10 w-10 object-contain" />
              </div>
            )}
            <div className="flex flex-col select-none">
              <span className="font-display text-2xl font-black tracking-tight text-brand-red leading-none uppercase">
                MEPA
              </span>
              <span className="font-sans text-xs font-bold tracking-widest text-white/90 uppercase mt-0.5">
                ACADEMY
              </span>
            </div>
          </a>

          <p className="mt-5 max-w-xs text-sm text-background/70">
            Modern Educational Proficiency Academy — empowering students with knowledge, character,
            and proficiency for a global future.
          </p>

          {/* Dynamic Social Links List */}
          <div className="mt-5 flex flex-wrap gap-2">
            {socialMediaLinks.map((link) => {
              const dynamicHref = s?.[link.providerKey as keyof typeof s] || link.fallbackUrl;

              if (!dynamicHref) return null;

              return (
                <SocialLink
                  key={link.label}
                  href={dynamicHref}
                  icon={link.icon}
                  label={link.label}
                />
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-background">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white transition-colors">
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
            <button className="bg-brand-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-red/90 transition-colors">
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