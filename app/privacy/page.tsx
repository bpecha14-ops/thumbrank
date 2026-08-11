export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-400">Last updated: August 2026</p>
      <div className="mt-6 space-y-4 text-gray-300">
        <p>By using ThumbRank, you agree to this privacy policy.</p>
        <p>ThumbRank does not store uploaded thumbnail images. All image processing happens client-side in your browser.</p>
        <p>We collect only your email address and license information needed to manage your account and paid features.</p>
        <p>Paddle, our payment provider, processes transactions and handles billing data according to its own privacy policy.</p>
        <p>Contact: support@thumbrank.com</p>
      </div>
    </div>
  );
}
