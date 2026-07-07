import { NextResponse } from "next/server";
import { site } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string | undefined;
  let website: string | undefined; // honeypot
  try {
    const body = await request.json();
    email = body.email?.trim();
    website = body.website;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (website) return NextResponse.json({ ok: true }); // bot
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

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
          from:
            process.env.CONTACT_FROM_EMAIL ??
            "Byte & Brain <onboarding@resend.dev>",
          to,
          subject: "Nova subscrição da newsletter",
          text: `Novo subscritor: ${email}`,
        }),
      });
      if (!res.ok) {
        console.error("Newsletter/Resend error:", await res.text());
        return NextResponse.json({ error: "send_failed" }, { status: 502 });
      }
    } catch (err) {
      console.error("Newsletter send failed:", err);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
  } else {
    // No provider wired yet — log so nothing is lost during setup.
    console.info("[newsletter] new subscriber (no RESEND_API_KEY set):", email);
  }

  return NextResponse.json({ ok: true });
}
