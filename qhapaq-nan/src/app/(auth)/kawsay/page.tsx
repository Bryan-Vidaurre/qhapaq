import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getProfile } from "@/lib/auth";
import { KawsayLeftSidebar } from "@/components/kawsay/KawsayLeftSidebar";
import { KawsayIndex } from "@/components/kawsay/KawsayIndex";
import { KawsayRightSidebar } from "@/components/kawsay/KawsayRightSidebar";

export const metadata = { title: "Kawsay · Qhapaq Ñan" };

export default async function KawsayPage() {
  const perfil = await getProfile();
  if (!perfil) redirect("/auth/magic-link?from=/kawsay");

  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex gap-5">
          <aside className="hidden w-56 shrink-0 lg:block">
            <KawsayLeftSidebar activeCategoria={null} />
          </aside>
          <div className="min-w-0 flex-1">
            <KawsayIndex perfil={perfil} />
          </div>
          <aside className="hidden w-56 shrink-0 xl:block">
            <KawsayRightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
