import { redirect } from "next/navigation";

// El flujo de registro está unificado en /auth/magic-link
export default function SignupRedirect() {
  redirect("/auth/magic-link");
}
