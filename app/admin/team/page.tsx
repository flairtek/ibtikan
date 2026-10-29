import { listTeamMembers } from "@/lib/repo";
import TeamEditor from "@/components/admin/TeamEditor";

export const metadata = { title: "Team & CEO profile — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function AdminTeamPage() {
  const team = await listTeamMembers();

  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-navy">Team &amp; CEO profile</h2>
      <p className="mt-1 text-sm text-muted">
        Edit the Chief Executive Officer biography, approved portrait and leadership record. Use only verified facts — the
        education timeline and the seven leadership priorities are fixed in code so unverified claims cannot be published
        from the dashboard.
      </p>
      <div className="mt-6">
        <TeamEditor team={team} />
      </div>
    </div>
  );
}
