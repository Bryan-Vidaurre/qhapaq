import { Header } from "@/components/layout/Header";
import { VerificacionClient } from "./VerificacionClient";

export const metadata = { title: "Verificación de identidad · Qhapaq Ñan" };

export default function VerificacionPage() {
  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />
      <VerificacionClient />
    </div>
  );
}
