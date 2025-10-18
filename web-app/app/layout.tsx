import type { Metadata } from 'next';
import './globals.css';
import '@coinbase/onchainkit/styles.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'xStream - Pay-Per-Second Video Platform',
  description: 'Revolutionary Web3 video platform where viewers pay only for what they watch, and creators keep 95% of earnings.',
};

// import next font
  

import { Lato } from 'next/font/google'

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} bg-background dark`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
