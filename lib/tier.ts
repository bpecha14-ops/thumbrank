export type Tier = "free" | "pro" | "creator_os";

export const FEATURE_LIMITS: Record<string, Record<Tier, number | boolean>> = {
  previews_per_day: { free: 3, pro: Infinity, creator_os: Infinity },
  competitors: { free: 1, pro: 5, creator_os: 10 },
  rescue_scans: { free: 0, pro: 1, creator_os: Infinity },
  ctr_alarm: { free: false, pro: false, creator_os: true },
  calibration: { free: false, pro: false, creator_os: true },
  fingerprint_history: { free: false, pro: true, creator_os: true },
};

export function checkAccess(userId: string, feature: string, tier: Tier = "pro"): { allowed: boolean; required?: Tier } {
  const limit = FEATURE_LIMITS[feature]?.[tier];
  if (limit === false) return { allowed: false, required: "creator_os" };
  if (typeof limit === "number" && limit !== Infinity) {
    // For count-based limits, the API route must check current usage separately
    return { allowed: true };
  }
  return { allowed: true };
}

export function tierGuard(tier: Tier, feature: string): { ok: boolean; upgrade?: string } {
  const limit = FEATURE_LIMITS[feature]?.[tier];
  if (limit === false) return { ok: false, upgrade: "creator_os" };
  if (typeof limit === "number" && limit === 0) return { ok: false, upgrade: "pro" };
  return { ok: true };
}

export async function getUserTier(userId: string): Promise<Tier> {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await supabase.from("profiles").select("tier").eq("id", userId).single();
  return (data?.tier as Tier) || "free";
}
