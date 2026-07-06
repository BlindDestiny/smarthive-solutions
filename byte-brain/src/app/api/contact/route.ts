import { NextResponse } from "next/server";
import { site } from "@/lib/site";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  // Honeypot — bots fill hidden fields; humans don't.
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Spam trap: silently accept but drop.
  if (data.website) return NextResponse.json({ ok: true });

  const name = data.name?.trim();
  const email = data.email?.trim();
  const message = data.message?.trim();

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  const lead = {
    name,
    email,
    company: data.company?.trim() ?? "",
    message,
    source: "website:contact",
  };

  // If Resend is configured, send a notification email; otherwise log the lead.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? `Byte & Brain <onboarding@resend.dev>`,
          to,
          reply_to: email,
          subject: `Novo lead do site — ${name}`,
          text: `Nome: ${name}\nEmail: ${email}\nEmpresa: ${lead.company}\n\n${message}`,
        }),
      });
      if (!res.ok) {
        console.error("Resend error:", await res.text());
        return NextResponse.json({ error: "send_failed" }, { status: 502 });
      }
    } catch (err) {
      console.error("Contact send failed:", err);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
  } else {
    // No email provider wired yet — log so nothing is lost in dev.
    console.info("[contact] new lead (no RESEND_API_KEY set):", lead);
  }

  return NextResponse.json({ ok: true });
}
