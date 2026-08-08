import Link from 'next/link'

export default function SiteNav() {
  return (
    <nav className="border-b border-gray-800 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">ThumbRank</Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
        </div>
      </div>
    </nav>
  )
}
