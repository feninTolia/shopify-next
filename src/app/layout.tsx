import { Navbar } from '@/components/Navbar';
import { ShopProvider } from '@/lib/context/shopContext';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './globals.css';
import { Footer } from '@/components/Footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Shopify + Next App',
  description: 'Modern eCommerce app',

  openGraph: {
    title: 'Shopify + Next App',
    type: 'website',
    url: 'https://shopify-next-teal-one.vercel.app',
    images: ['https://shopify-next-teal-one.vercel.app/share.png'],
    description: 'Modern eCommerce app',
    locale: 'en-US',
    siteName: 'Modern eCommerce app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ShopProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex flex-col justify-between min-h-screen">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ShopProvider>
  );
}
