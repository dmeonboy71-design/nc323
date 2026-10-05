import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pakistan Youth Loan Portal - Ministry of Finance',
  description: 'Official portal for loan assistance programme by Ministry of Finance, Government of Pakistan.',
  icons: {
    icon: '/logo.jpg',
  },
  openGraph: {
    title: 'Pakistan Youth Loan Portal - Ministry of Finance',
    description: 'Official portal for loan assistance programme by Ministry of Finance, Government of Pakistan.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pakistan Youth Loan Portal - Ministry of Finance',
    description: 'Official portal for loan assistance programme by Ministry of Finance, Government of Pakistan.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&family=Noto+Sans+Arabic:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
