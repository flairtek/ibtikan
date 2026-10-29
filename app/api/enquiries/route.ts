import { NextResponse } from "next/server";
import { createEnquiry, checkRateLimit, hashIp } from "@/lib/repo";
import { clientIp, isSameOriginRequest } from "@/lib/guard";
import { sendEnquiryNotification } from "@/lib/mail";
import { getSetting } from "@/lib/repo";
import { enquiryTypes } from "@/lib/brand";

const MAX_LEN = 2000;

interface Payload {
  name?: string;
  email?: string;
  phone?: string | null;
  type?: string;
  propertyRef?: string | null;
  propertyId?: number | null;
  country?: string | null;
  preferredContact?: string;
  message?: string;
  consent?: boolean;
  source?: string;
  startedAt?: number;
  honeypot?: string;
}

export async function POST(request: Request) {
  try {
    if (!(await isSameOriginRequest(request))) {
      return json({ error: "Cross-origin request rejected." }, 403);
    }
  } catch {
    return json({ error: "Origin validation failed." }, 403);
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  // Honeypot: pretend success to bots that filled it.
  if (body.honeypot && body.honeypot.trim().length > 0) {
    return json({ ok: true }, 200);
  }

  // Minimum time-on-form and validity: absent or implausible timestamps
  // are treated as invalid submissions.
  const started = body.startedAt;
  const validStartedAt =
    typeof started === "number" &&
    started <= Date.now() &&
    started > Date.now() - 1000 * 60 * 60 * 24;
  if (!validStartedAt) {
    return json({ error: "Form could not be validated. Please reload and retry." }, 400);
  }
  if (Date.now() - started < 1500) {
    return json(
      { error: "Submitting that quickly is not possible — please fill the form normally." },
      400
    );
  }

  const fieldErrors: Record<string, string> = {};
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim() || null;
  const message = (body.message ?? "").trim();
  const type = enquiryTypes.some((t) => t.value === body.type) ? (body.type as string) : "general";
  const preferredContact = ["email", "phone"].includes(body.preferredContact ?? "")
    ? (body.preferredContact as string)
    : "email";

  if (name.length < 2) fieldErrors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = "Please enter a valid email address.";
  if (message.length < 10) fieldErrors.message = "Please write a message of at least 10 characters.";
  if (message.length > MAX_LEN) fieldErrors.message = "Message is too long (2000 characters max).";
  if (!body.consent) fieldErrors.consent = "Please confirm you agree to be contacted.";
  if (phone && !/^[\d\s()+-]{6,25}$/.test(phone))
    fieldErrors.phone = "Please enter a valid telephone number.";

  if (Object.keys(fieldErrors).length > 0) {
    return json({ error: "Please correct the highlighted fields.", fieldErrors }, 400);
  }

  const ipHash = hashIp(clientIp(request));
  const allowed = await checkRateLimit(ipHash);
  if (!allowed) {
    return json(
      { error: "You have reached today's enquiry limit. Please call or email us instead." },
      429
    );
  }

  const id = await createEnquiry({
    name,
    email,
    phone,
    type,
    source: (body.source ?? "enquire").slice(0, 80),
    propertyId: typeof body.propertyId === "number" ? body.propertyId : null,
    propertyRef: body.propertyRef ? String(body.propertyRef).slice(0, 60) : null,
    country: body.country ? String(body.country).slice(0, 60) : null,
    preferredContact,
    message,
    consent: true,
    ipHash: ipHash.slice(0, 16),
  });

  if (id == null) {
    return json(
      { error: "This exact enquiry was already submitted a few minutes ago." },
      409
    );
  }

  // Email notification is best-effort: persistence already succeeded.
  let notificationEmail = "info@ibtikanproperties.com";
  try {
    const configured = await getSetting<string | null>("site.notificationEmail", null);
    if (configured) notificationEmail = configured;
  } catch {
    // fall back to the default address
  }
  void sendEnquiryNotification(
    {
      name,
      email,
      phone,
      type,
      source: body.source ?? "enquire",
      propertyRef: body.propertyRef ?? null,
      country: body.country ?? null,
      preferredContact,
      message,
      id,
    },
    notificationEmail
  );

  return json({ ok: true, id }, 200);
}

function json(data: unknown, status: number) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
