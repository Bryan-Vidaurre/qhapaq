import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getProfile } from "@/lib/auth";
import { YachayFeed } from "@/components/yachay/YachayFeed";
import { LeftSidebar } from "@/components/yachay/LeftSidebar";
import { RightSidebar } from "@/components/yachay/RightSidebar";

export const metadata = { title: "Yachay · Qhapaq Ñan" };

export default async function YachayPage() {
  const perfil = await getProfile();
  if (!perfil) redirect("/auth/magic-link?from=/yachay");

  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex gap-5">
          {/* Left sidebar — visible desde lg */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <LeftSidebar perfil={perfil} />
          </aside>

          {/* Feed central */}
          <div className="min-w-0 flex-1">
            <YachayFeed perfil={perfil} />
          </div>

          {/* Right sidebar — visible desde xl */}
          <aside className="hidden w-60 shrink-0 xl:block">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
