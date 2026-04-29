import { Header } from "@/components/layout/Header";
import { PublicProfile } from "@/components/perfil/PublicProfile";

export const metadata = { title: "Perfil · Qhapaq Ñan" };

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />
      <PublicProfile userId={params.id} />
    </div>
  );
}
