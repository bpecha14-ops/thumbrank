import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: analyses, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!analyses || analyses.length === 0) return NextResponse.json({ empty: true, count: 0 });

  const avg = (key: string) =>
    Math.round(analyses.reduce((sum, a) => sum + (a.scores?.[key] || 0), 0) / analyses.length);

  const components = [
    { key: "contrast", label: "Contrast", value: avg("contrast") || avg("total") },
    { key: "text", label: "Text", value: avg("text") || avg("total") },
    { key: "focal", label: "Focal Point", value: avg("focal") || avg("total") },
    { key: "clutter", label: "Clutter", value: avg("clutter") || avg("total") },
  ];

  const weakest = components.reduce((a, b) => (a.value < b.value ? a : b));
  const streak = analyses.filter((a) => (a.scores?.total || 0) >= 70).length;
  const count = analyses.length;

  let level = "Rookie";
  let nextLevel = 50;
  if (count >= 200) { level = "Thumbnail Pro"; nextLevel = 200; }
  else if (count >= 50) { level = "Packager"; nextLevel = 200; }

  return NextResponse.json({
    total: avg("total"),
    components,
    weakest,
    streak,
    count,
    level,
    nextLevel,
    percentile: 50,
    empty: false,
  });
}
