import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await request.json();
    const eventType = body.event_type;
    const data = body.data;

    if (
      eventType === "subscription.created" ||
      eventType === "subscription.updated" ||
      eventType === "subscription.activated"
    ) {
      const customerEmail = data.customer?.email;
      const subscriptionId = data.id;
      const status = data.status;

      if (customerEmail) {
        const { error } = await supabase.from("subscriptions").upsert(
          {
            email: customerEmail.toLowerCase(),
            paddle_subscription_id: subscriptionId,
            status: status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        );

        if (error) {
          console.error("Supabase error:", error);
          return NextResponse.json({ error: "DB error" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
