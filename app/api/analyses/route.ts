import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { type, scores, input_meta } = await req.json();
    const { data, error } = await supabase.from("analyses").insert({
      user_id: "00000000-0000-0000-0000-000000000000",
      type: type || "single",
      scores,
      input_meta,
    }).select().single();
    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
