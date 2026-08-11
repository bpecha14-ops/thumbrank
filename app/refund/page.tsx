export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-16">
      <main className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
        <div className="space-y-6 text-neutral-300 text-sm leading-relaxed">
          <p className="text-base text-white">30-day money-back guarantee. Contact us within 30 days for full refund.</p>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Eligibility</h2>
            <p>Purchases are eligible for a full refund when requested within 30 days of the original purchase date.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. How to request</h2>
            <p>Contact us within 30 days of purchase and include the email address used for the purchase and your license or order details so we can locate the transaction.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Processing time</h2>
            <p>Approved refunds are sent back through the original payment method. Please allow 3–5 business days for processing, plus any additional time required by your payment provider.</p>
          </section>
          <p className="text-neutral-500 pt-4">Last updated: August 2026</p>
        </div>
      </main>
    </div>
  );
}
