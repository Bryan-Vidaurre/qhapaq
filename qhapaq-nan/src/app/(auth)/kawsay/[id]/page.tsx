import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getProfile } from "@/lib/auth";
import { KawsayLeftSidebar } from "@/components/kawsay/KawsayLeftSidebar";
import { KawsayRightSidebar } from "@/components/kawsay/KawsayRightSidebar";
import { TemaThread } from "@/components/kawsay/TemaThread";

export const metadata = { title: "Tema · Kawsay · Qhapaq Ñan" };

export default async function TemaPage({ params }: { params: { id: string } }) {
  const perfil = await getProfile();
  if (!perfil) redirect(`/auth/magic-link?from=/kawsay/${params.id}`);

  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex gap-5">
          <aside className="hidden w-56 shrink-0 lg:block">
            <KawsayLeftSidebar activeCategoria={null} />
          </aside>
          <div className="min-w-0 flex-1">
            <TemaThread temaId={params.id} perfil={perfil} />
          </div>
          <aside className="hidden w-56 shrink-0 xl:block">
            <KawsayRightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
