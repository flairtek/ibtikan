import "server-only";
import { company } from "./brand";
import { runtimeVar } from "./db";

/**
 * Enquiry notifications through the Resend HTTP API.
 * Requires RESEND_API_KEY and (once the custom domain is verified in Resend)
 * sets RESEND_FROM. Without configuration the email is skipped silently —
 * the enquiry is already persisted, and administrators see it in /admin/enquiries.
 */

export interface EnquiryNotificationData {
  name: string;
  email: string;
  phone?: string | null;
  type: string;
  source: string;
  propertyRef?: string | null;
  country?: string | null;
  preferredContact?: string | null;
  message: string;
  id?: number;
}

export async function sendEnquiryNotification(
  data: EnquiryNotificationData,
  notificationEmail: string
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = runtimeVar("RESEND_API_KEY");
  if (!apiKey) return { sent: false, error: "RESEND_API_KEY not configured" };

  const from =
    runtimeVar("RESEND_FROM") ?? "Ibtikan Properties <onboarding@resend.dev>";
  const lines = [
    `New website enquiry #${data.id ?? ""} (${data.type}, from "${data.source}")`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.propertyRef ? `Property reference: ${data.propertyRef}` : null,
    data.country ? `Country of residence: ${data.country}` : null,
    data.preferredContact ? `Preferred contact: ${data.preferredContact}` : null,
    "",
    data.message,
  ].filter(Boolean) as string[];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [notificationEmail],
        reply_to: data.email,
        subject: `New ${data.type} enquiry — ${company.shortName}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(
        "mail: Resend rejected the message",
        res.status,
        text.slice(0, 200)
      );
      return { sent: false, error: `Resend ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("mail: failed to send notification");
    if (process.env.NODE_ENV !== "production") console.error(String(err));
    return { sent: false, error: "network" };
  }
}
