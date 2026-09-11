import { createClient } from "@supabase/supabase-js";
import { Sparkles, Download } from "lucide-react";

export const dynamic = "force-dynamic";

const BUCKET = "downloads";
const FOLDER = "thumbnail-system";

export default async function DownloadPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  const invalid = (
    <main className="min-h-screen text-white flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Invalid link</h1>
        <p className="text-white/50 text-sm">Contact support if you just purchased.</p>
      </div>
    </main>
  );

  if (!token) return invalid;

  const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: purchase } = await supa
    .from("purchases")
    .select("id, download_count")
    .eq("token", token)
    .single();

  if (!purchase) return invalid;

  const { data: files, error } = await supa.storage
    .from(BUCKET)
    .list(FOLDER, { limit: 100, sortBy: { column: "name", order: "asc" } });

  if (error || !files) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-white/50 text-sm">Try again later or contact support.</p>
        </div>
      </main>
    );
  }

  const items = await Promise.all(
    files
      .filter((f) => f.name.endsWith(".png") || f.name.endsWith(".txt"))
      .map(async (f) => {
        const { data } = await supa.storage
          .from(BUCKET)
          .createSignedUrl(`${FOLDER}/${f.name}`, 3600, { download: true });
        return { name: f.name, url: data?.signedUrl || "" };
      })
  );

  await supa.from("purchases").update({ download_count: purchase.download_count + 1 }).eq("id", purchase.id);

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">ThumbRank — The Thumbnail System</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Your templates are ready 🎉</h1>
        <p className="text-white/50 mb-8 text-sm">
          {items.length} files · links valid 1 hour · save this page URL — it always gives you the latest version
        </p>
        <div className="space-y-2">
          {items.map((item) => (
            <a key={item.name} href={item.url}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm px-4 py-3 hover:border-pink-500/40 transition-all">
              <span className="text-sm text-white/80 truncate">{item.name}</span>
              <span className="flex items-center gap-1 text-xs text-pink-400 font-medium shrink-0">
                <Download className="w-3.5 h-3.5" /> Download
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
