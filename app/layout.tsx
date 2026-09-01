import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://thumbrankpro.com'),
  title: 'ThumbRank — Preview Your YouTube Thumbnails Before You Publish',
  description:
    'ThumbRank lets creators preview how their YouTube thumbnail looks in a real search results mockup. Test against competitors, run A/B tests, and get a CTR score — all in your browser.',
  openGraph: {
    title: 'ThumbRank — Preview Your YouTube Thumbnails Before You Publish',
    description:
      'See your thumbnail in a realistic YouTube search mockup. A/B test variants, get a CTR score, and export as PNG.',
    url: 'https://thumbrankpro.com',
    siteName: 'ThumbRank',
    images: [
      {
        url: 'https://thumbrankpro.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ThumbRank AI Thumbnail Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bpecha14',
    creator: '@bpecha14',
    title: 'ThumbRank — Preview Your YouTube Thumbnails Before You Publish',
    description:
      'See your thumbnail in a realistic YouTube search mockup. A/B test variants, get a CTR score, and export as PNG.',
    images: ['https://thumbrankpro.com/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
