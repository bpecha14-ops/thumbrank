export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-16">
      <main className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-6 text-neutral-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance</h2>
            <p>By accessing or using ThumbRank, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Service description</h2>
            <p>ThumbRank is a SaaS thumbnail preview service that lets you view thumbnail designs in a realistic YouTube search results layout and evaluate them before publishing.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Payments via Paddle</h2>
            <p>Paid features are purchased through Paddle, our payment provider. Paddle handles payment processing, billing, and applicable taxes according to its own terms and policies.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Termination</h2>
            <p>We may suspend or terminate access to the service if you violate these terms, misuse the service, or create risk for other users or the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Liability</h2>
            <p>ThumbRank is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Changes</h2>
            <p>We may update these terms from time to time. Continued use of ThumbRank after changes are posted means you accept the updated terms.</p>
          </section>
          <p className="text-neutral-500 pt-4">Last updated: August 2026</p>
        </div>
      </main>
    </div>
  );
}
