import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/posts/[id]/like   — toggle like (add if absent, remove if present)
 * DELETE /api/posts/[id]/like — explicit unlike
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const postId = params.id;

  // Check if already liked
  const { data: existing } = await supabase
    .from("post_reactions")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // Remove like
    await supabase
      .from("post_reactions")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    return NextResponse.json({ liked: false });
  } else {
    // Add like
    const { error } = await supabase
      .from("post_reactions")
      .insert({ post_id: postId, user_id: user.id });
    if (error) return NextResponse.json({ error: "Error" }, { status: 500 });
    return NextResponse.json({ liked: true });
  }
}
