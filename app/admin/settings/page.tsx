import { getSetting, listAdmins } from "@/lib/admin-data";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Website settings — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const [notificationEmail, admins] = await Promise.all([
    getSetting<string>("site.notificationEmail", "info@ibtikanproperties.com"),
    listAdmins(),
  ]);

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-2xl font-bold text-navy">Website settings</h2>
      <p className="mt-1 text-sm text-muted">
        Enquiry notifications and administrator access. Email delivery activates automatically once RESEND_API_KEY is set in
        Sites → Secrets — the key itself is never stored in the project.
      </p>
      <div className="mt-6">
        <SettingsForm notificationEmail={notificationEmail} admins={admins} />
      </div>
    </div>
  );
}
