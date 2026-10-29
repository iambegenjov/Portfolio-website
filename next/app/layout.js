import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Nav from '@/components/Nav';
import Footer, { BackTop } from '@/components/Footer';
import ScrollReset from '@/components/ScrollReset';
import { getSite } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-body', display: 'swap' });
const faculty = localFont({ src: './fonts/FacultyGlyphic-Regular.ttf', variable: '--font-display', display: 'swap' });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Muhammet Begenjov — Portfolio',
  description: 'Muhammet Begenjov: brand, retail and digital design.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f5f3ee',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${faculty.variable}`}>
      <body>
        <ScrollReset />
        <Nav />
        <main className="page">
          {children}
          <BackTop />
        </main>
        <Footer site={getSite()} />
      </body>
    </html>
  );
}
