import { Open_Sans } from 'next/font/google'
import "./globals.css";

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-open-sans',
})

export const metadata = {
  title: "The Porch — Shepherd Community Center",
  description: "Community services kiosk",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full ${openSans.variable}`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
