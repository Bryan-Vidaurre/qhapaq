import { Header } from "@/components/layout/Header";
import { EditarPerfilClient } from "./EditarPerfilClient";

export const metadata = { title: "Editar perfil · Qhapaq Ñan" };

export default function EditarPerfilPage() {
  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />
      <EditarPerfilClient />
    </div>
  );
}
