import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thumbrankpro.com'),
  title: 'ThumbRank — Preview Your YouTube Thumbnails Before You Publish',
  description:
    'ThumbRank lets creators preview how their YouTube thumbnail looks in a real search results mockup. Test against competitors, run A/B tests, and get a CTR score — all in your browser.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'ThumbRank — Preview Your YouTube Thumbnails Before You Publish',
    description:
      'See your thumbnail in a realistic YouTube search mockup. A/B test variants, get a CTR score, and export as PNG.',
    images: [
      {
        url: '/thumbrank_og_image.png',
        width: 1200,
        height: 630,
        alt: 'ThumbRank — Stop guessing. Start ranking.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: '/thumbrank_og_image.png',
        width: 1200,
        height: 630,
        alt: 'ThumbRank — Stop guessing. Start ranking.',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-[#1C1428] text-white antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
