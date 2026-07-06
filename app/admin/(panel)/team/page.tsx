import { prisma } from "@/lib/prisma";
import { TeamManager, type TeamMember } from "@/components/admin/TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members: TeamMember[] = await prisma.teamMember.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });

  return <TeamManager members={members} />;
}
