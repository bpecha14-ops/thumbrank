import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { handle } = await req.json();
    if (!handle) return NextResponse.json({ error: "Missing handle" }, { status: 400 });

    const cleanHandle = handle.replace("@", "").trim();

    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${cleanHandle}&key=${process.env.YOUTUBE_API_KEY}`
    );
    const ytData = await ytRes.json();
    const channel = ytData.items?.[0];

    if (!channel) return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    const { data, error } = await supabase.from("competitors").insert({
      user_id: "00000000-0000-0000-0000-000000000000",
      channel_id: channel.id,
      channel_title: channel.snippet.title,
      channel_avatar: channel.snippet.thumbnails?.default?.url || "",
      avg_views: parseInt(channel.statistics.viewCount) || 0,
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ id: data.id, title: data.channel_title });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("competitors")
    .select("*")
    .eq("user_id", "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ competitors: data });
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await supabase.from("competitors").delete().eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
