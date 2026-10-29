"use client";

import { useEffect, useRef, useState } from "react";
import { enquiryTypes } from "@/lib/brand";

interface EnquiryFormProps {
  /** Which page the form lives on, recorded with the enquiry. */
  source: string;
  /** Fixed enquiry type; omit to let the visitor pick one. */
  defaultType?: string;
  defaultPropertyRef?: string;
  propertyId?: number;
  showCountry?: boolean;
  compact?: boolean;
}

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({
  source,
  defaultType,
  defaultPropertyRef = "",
  propertyId,
  showCountry = false,
  compact = false,
}: EnquiryFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const clientErrors: Record<string, string> = {};
    const value = (n: string) => String(data.get(n) ?? "").trim();
    if (value("name").length < 2)
      clientErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email")))
      clientErrors.email = "Please enter a valid email address.";
    if (value("message").length < 10)
      clientErrors.message = "Please write at least a short message (10+ characters).";
    if (!data.get("consent"))
      clientErrors.consent = "Please confirm you agree to be contacted.";
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setMessage("Please correct the highlighted fields.");
      setStatus("error");
      return;
    }
    setFieldErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          email: value("email"),
          phone: value("phone") || null,
          type: defaultType ?? value("type") ?? "general",
          status: "", // unused; sent as empty to keep payload tidy
          propertyRef: value("propertyRef") || null,
          country: showCountry ? value("country") || null : null,
          preferredContact: value("preferredContact"),
          message: value("message"),
          consent: true,
          source,
          propertyId: propertyId ?? null,
          startedAt: mountedAt.current,
          honeypot: value("company"),
        }),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
          fieldErrors?: Record<string, string>;
        } | null;
        setFieldErrors(body?.fieldErrors ?? {});
        setMessage(
          body?.error ?? "The enquiry could not be sent. Please try again or call us."
        );
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setMessage(
        "A network error occurred. Please try again or call us directly."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="card p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage/10 text-sage"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-navy">Thank you — enquiry received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Your enquiry has been recorded successfully and a member of our team
          will contact you using the details you provided. For anything urgent,
          please call us directly.
        </p>
      </div>
    );
  }

  const err = (field: string) =>
    fieldErrors[field] ? (
      <p id={`err-${field}`} role="alert" className="mt-1 text-xs font-semibold text-red-600">
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className={compact ? "" : "card p-6 sm:p-8"}>
      {status !== "idle" && status !== "submitting" && message && (
        <p
          role="alert"
          className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          aria-live="assertive"
        >
          {message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="enq-name" className="label">
            Full name <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <input
            id="enq-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={fieldErrors.name ? "true" : "false"}
            aria-describedby={fieldErrors.name ? "err-name" : undefined}
            className="input"
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="enq-email" className="label">
            Email <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <input
            id="enq-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={fieldErrors.email ? "true" : "false"}
            aria-describedby={fieldErrors.email ? "err-email" : undefined}
            className="input"
          />
          {err("email")}
        </div>
        <div>
          <label htmlFor="enq-phone" className="label">
            Telephone (with country code)
          </label>
          <input
            id="enq-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+233 24 000 0000"
            className="input"
          />
        </div>
        {!defaultType && (
          <div>
            <label htmlFor="enq-type" className="label">
              Enquiry type
            </label>
            <select id="enq-type" name="type" className="input" defaultValue="general">
              {enquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="enq-propertyref" className="label">
            Property reference (if applicable)
          </label>
          <input
            id="enq-propertyref"
            name="propertyRef"
            type="text"
            defaultValue={defaultPropertyRef}
            placeholder="e.g. IBT-001"
            className="input"
          />
        </div>
        {showCountry && (
          <div>
            <label htmlFor="enq-country" className="label">
              Country of residence
            </label>
            <input id="enq-country" name="country" type="text" className="input" />
          </div>
        )}
        <div>
          <label htmlFor="enq-pref" className="label">
            Preferred contact method
          </label>
          <select id="enq-pref" name="preferredContact" className="input" defaultValue="email">
            <option value="email">Email</option>
            <option value="phone">Telephone</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="enq-message" className="label">
          Message <span aria-hidden="true" className="text-red-600">*</span>
        </label>
        <textarea
          id="enq-message"
          name="message"
          rows={compact ? 4 : 6}
          required
          maxLength={2000}
          aria-describedby={fieldErrors.message ? "err-message" : undefined}
          className="input"
          placeholder="Tell us what you are looking for — property type, location, budget and any questions."
        />
        {err("message")}
      </div>

      <div className="mt-5">
        <label htmlFor="enq-consent" className="flex items-start gap-3 text-sm text-muted">
          <input
            id="enq-consent"
            name="consent"
            type="checkbox"
            required
            aria-describedby={fieldErrors.consent ? "err-consent" : undefined}
            className="mt-0.5 h-4 w-4 rounded border-line accent-gold"
          />
          <span>
            I agree that {`Ibtikan Ibn Adams Properties Limited`} may store these
            details and contact me about my enquiry. See our{" "}
            <a href="/privacy-policy" className="underline">
              Privacy Policy
            </a>
            . <span aria-hidden="true" className="text-red-600">*</span>
          </span>
        </label>
        {err("consent")}
      </div>

      {/* Honeypot — hidden from users and assistive technology */}
      <div aria-hidden="true" className="absolute left-0 h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="enq-company">Company</label>
        <input id="enq-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Sending…
          </span>
        ) : (
          "Send Enquiry"
        )}
      </button>
    </form>
  );
}
