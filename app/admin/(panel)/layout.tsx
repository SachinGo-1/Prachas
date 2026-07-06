import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Defense in depth — middleware already redirects, but never render the
  // shell for an unauthenticated request.
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <AuthProvider>
      <AdminShell user={{ name: session.user.name, email: session.user.email }}>
        {children}
      </AdminShell>
    </AuthProvider>
  );
}
