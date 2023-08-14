import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@cloudscape-design/global-styles/index.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AWS CDK Translator',
  description: 'Translate AWS CDK code written in TypeScript to Python, Java, C#, or Go.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Script src="./coi-serviceworker.min.js" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
