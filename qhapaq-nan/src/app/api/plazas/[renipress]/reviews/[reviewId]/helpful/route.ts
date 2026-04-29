import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: { renipress: string; reviewId: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Check if already marked
  const { data: existing } = await supabase
    .from("review_helpful")
    .select("review_id")
    .eq("review_id", params.reviewId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("review_helpful")
      .delete().eq("review_id", params.reviewId).eq("user_id", user.id);
    return NextResponse.json({ helpful: false });
  } else {
    await supabase.from("review_helpful")
      .insert({ review_id: params.reviewId, user_id: user.id });
    return NextResponse.json({ helpful: true });
  }
}
