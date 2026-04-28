"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-qn-border bg-qn-paper px-4 py-2 text-xs text-qn-ink hover:border-qn-terracotta disabled:opacity-50"
    >
      {loading ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}
