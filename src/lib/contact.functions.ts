import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  phone: z.string().max(40).optional().nullable(),
  message: z.string().min(1).max(5000),
});

const CONTACT_TO = "swatifylabs@gmail.com";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Email provider not configured yet. Message is still saved client-side.
      return { sent: false, reason: "no_provider" as const };
    }
    const from = process.env.CONTACT_FROM_EMAIL ?? "MEPA Academy <onboarding@resend.dev>";
    const html = `
      <h2 style="font-family:Arial,sans-serif">New contact message — MEPA Academy</h2>
      <p style="font-family:Arial,sans-serif"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p style="font-family:Arial,sans-serif"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      ${data.phone ? `<p style="font-family:Arial,sans-serif"><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
      <p style="font-family:Arial,sans-serif"><strong>Message:</strong></p>
      <p style="font-family:Arial,sans-serif;white-space:pre-line">${escapeHtml(data.message)}</p>
    `;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_TO],
        reply_to: data.email,
        subject: `New contact from ${data.name}`,
        html,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Resend error", res.status, text);
      return { sent: false, reason: "send_failed" as const };
    }
    return { sent: true };
  });
