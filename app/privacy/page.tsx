export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-16">
      <main className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-neutral-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Data collection</h2>
            <p>We collect only the information needed to provide and manage your ThumbRank account and paid features, such as your email address and purchase or license information.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Image processing</h2>
            <p><strong className="text-white">We do not store uploaded images. All processing happens client-side.</strong> Your thumbnail files are processed in your browser and are not uploaded to our servers.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Third parties</h2>
            <p>Paddle processes payments and may collect information necessary to complete transactions, provide billing services, and meet legal requirements. Their handling of information is governed by their own privacy policy.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Contact</h2>
            <p>If you have questions about this Privacy Policy or how your information is handled, please contact the ThumbRank team.</p>
          </section>
          <p className="text-neutral-500 pt-4">Last updated: August 2026</p>
        </div>
      </main>
    </div>
  );
}
