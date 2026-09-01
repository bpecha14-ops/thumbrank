import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get channel connection
    const { data: conn } = await supabase
      .from("channel_connections")
      .select("access_token, refresh_token, token_expires_at, channel_id")
      .eq("user_id", "00000000-0000-0000-0000-000000000000")
      .single();

    if (!conn) return NextResponse.json({ error: "No channel" }, { status: 400 });

    // 2. Refresh token if needed
    let accessToken = conn.access_token;
    if (new Date(conn.token_expires_at) < new Date()) {
      const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: conn.refresh_token,
          grant_type: "refresh_token",
        }),
      });
      const tokens = await refreshRes.json();
      accessToken = tokens.access_token;
      await supabase.from("channel_connections").update({
        access_token: tokens.access_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      }).eq("user_id", "00000000-0000-0000-0000-000000000000");
    }

    // 3. Get analytics: CTR + impressions + avgViewPercentage for last 90 days
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];

    const analyticsRes = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?` +
      `ids=channel==MINE&startDate=${startDate}&endDate=${endDate}&` +
      `metrics=impressions,impressionsClickThroughRate,averageViewPercentage&` +
      `dimensions=video&sort=-impressions&maxResults=50`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!analyticsRes.ok) {
      const err = await analyticsRes.text();
      return NextResponse.json({ error: `Analytics ${analyticsRes.status}: ${err}` }, { status: 500 });
    }

    const data = await analyticsRes.json();
    const rows = data.rows || [];

    // 4. Calculate median CTR
    const ctrs = rows.map((r: any) => parseFloat(r[2])).filter((c: number) => c > 0).sort((a: number, b: number) => a - b);
    const medianCtr = ctrs.length > 0 ? ctrs[Math.floor(ctrs.length / 2)] : 0;

    // 5. Find rescue candidates: CTR < 60% median, impressions > 1000
    const candidates = rows
      .map((r: any) => ({
        videoId: r[0],
        impressions: parseInt(r[1]),
        ctr: parseFloat(r[2]),
        avgViewPct: parseFloat(r[3]),
      }))
      .filter((v: any) => v.impressions > 1000 && v.ctr < medianCtr * 0.6);

    // 6. Get video details (title + thumbnail)
    const videoIds = candidates.map((c: any) => c.videoId).join(",");
    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const detailsData = await detailsRes.json();
    const detailsMap = new Map();
    detailsData.items?.forEach((item: any) => {
      detailsMap.set(item.id, {
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url || "",
      });
    });

    // 7. Save to rescue_reports
    for (const c of candidates) {
      const d = detailsMap.get(c.videoId);
      await supabase.from("rescue_reports").upsert({
        user_id: "00000000-0000-0000-0000-000000000000",
        video_id: c.videoId,
        title: d?.title || "Unknown",
        thumbnail_url: d?.thumbnail || "",
        ctr: c.ctr,
        channel_median_ctr: medianCtr,
        impressions: c.impressions,
        scan_date: new Date().toISOString().split("T")[0],
      }, { onConflict: "user_id,video_id,scan_date" });
    }

    return NextResponse.json({
      ok: true,
      scanned: rows.length,
      candidates: candidates.length,
      medianCtr,
    });
  } catch (err: any) {
    console.error("Rescue scan error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
