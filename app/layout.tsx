import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bulk Image Resizer - Professional Image Processing',
  description: 'Fast, secure, and professional bulk image resizing tool. Process multiple images client-side with privacy protection. Resize, compress, and optimize images for web, social media, and more.',
  keywords: 'image resizer, bulk image processing, image compression, resize images, image optimizer, photo resizer, batch image processing',
  authors: [{ name: 'Bulk Image Resizer' }],
  creator: 'Professional Image Tools',
  publisher: 'Image Processing Suite',
  robots: 'index, follow',
  openGraph: {
    title: 'Bulk Image Resizer - Professional Image Processing',
    description: 'Fast, secure, and professional bulk image resizing tool with client-side processing.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Image Resizer - Professional Image Processing',
    description: 'Fast, secure, and professional bulk image resizing tool with client-side processing.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e40af',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}