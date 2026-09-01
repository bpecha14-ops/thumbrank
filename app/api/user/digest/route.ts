import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: videos, error } = await supabase
    .from("competitor_videos")
    .select("*, competitors(channel_title)")
    .eq("digest_sent", false)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formatted = videos?.map((v: any) => ({
    ...v,
    channel_title: v.competitors?.channel_title || "Unknown",
  })) || [];

  return NextResponse.json({ videos: formatted });
}
