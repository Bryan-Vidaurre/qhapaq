import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Check if already voted
  const { data: existing } = await supabase
    .from("kawsay_votos")
    .select("tema_id")
    .eq("tema_id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("kawsay_votos")
      .delete().eq("tema_id", params.id).eq("user_id", user.id);
    return NextResponse.json({ voted: false });
  } else {
    await supabase.from("kawsay_votos")
      .insert({ tema_id: params.id, user_id: user.id });
    return NextResponse.json({ voted: true });
  }
}
