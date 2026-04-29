import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();

  const { data: perfil, error } = await supabase
    .from("perfiles")
    .select("user_id, nombre_publico, username, avatar_url, bio, prof_level, profesion_declarada_id, yachay, created_at")
    .eq("user_id", params.id)
    .single();

  if (error || !perfil) {
    return NextResponse.json({ data: null }, { status: 404 });
  }

  return NextResponse.json({ data: perfil });
}
