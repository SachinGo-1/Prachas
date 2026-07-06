import { getSettings } from "@/lib/settings";
import { SettingsForm, ChangePasswordForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-4xl space-y-8">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-ink">Company information</h2>
        <p className="mt-1 text-sm text-brand-muted">
          These values appear across the public site (footer and contact page).
        </p>
        <div className="mt-6">
          <SettingsForm initial={settings} />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-ink">Change password</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Update the password for your admin account.
        </p>
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
