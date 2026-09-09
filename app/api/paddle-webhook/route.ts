import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx > 0) parts[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex");
  const a = Buffer.from(h1, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function getCustomerEmail(customerId: string): Promise<string> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey || !customerId) return "";
  try {
    const res = await fetch(`https://api.paddle.com/customers/${customerId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("WEBHOOK: customer lookup failed", res.status);
      return "";
    }
    const json: any = await res.json();
    return json?.data?.email || "";
  } catch (err: any) {
    console.error("WEBHOOK: customer lookup error", err.message);
    return "";
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const secret = process.env.PADDLE_WEBHOOK_SECRET || "";

  if (!verifySignature(rawBody, req.headers.get("paddle-signature"), secret)) {
    console.error("WEBHOOK: invalid signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: any;
  try { event = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }

  if (event.event_type !== "transaction.completed") {
    return NextResponse.json({ ok: true, ignored: event.event_type });
  }

  const txn = event.data || {};
  const txnId: string = txn.id || "";
  const customerId: string = txn.customer_id || "";

  let email: string = txn.customer?.email || txn.customer_email || "";

  // Paddle does not include the customer object in transaction.completed —
  // resolve the email via the Customers API using customer_id.
  if (!email && customerId) {
    email = await getCustomerEmail(customerId);
  }

  if (!txnId) {
    console.error("WEBHOOK: missing txn id");
    return NextResponse.json({ ok: true, logged: "missing-txn" });
  }

  if (!email) {
    console.error("WEBHOOK: could not resolve email for customer", customerId);
    return NextResponse.json({ ok: true, logged: "no-email" });
  }

  const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const token = crypto.randomBytes(24).toString("hex");

  const { error: dbError } = await supa.from("purchases").insert({
    email,
    paddle_transaction_id: txnId,
    token,
  });

  if (dbError) {
    if (dbError.code === "23505") return NextResponse.json({ ok: true, duplicate: true });
    console.error("WEBHOOK: db error", dbError);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  const downloadUrl = `https://thumbrankpro.com/download?token=${token}`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ThumbRank <downloads@thumbrankpro.com>",
        to: email,
        subject: "Your Thumbnail System is here 🎉",
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="margin:0 0 16px;">Thanks for your purchase!</h2>
            <p style="color:#666;">Your copy of <strong>The Thumbnail System</strong> is ready.</p>
            <a href="${downloadUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#db2777;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Download templates</a>
            <p style="color:#999;font-size:12px;">Save this email — the link works anytime and always gives you the latest version. Questions? Reply to this email.</p>
          </div>
        `,
      }),
    });
  } catch (err: any) {
    console.error("WEBHOOK: email error", err.message);
  }

  return NextResponse.json({ ok: true });
}
