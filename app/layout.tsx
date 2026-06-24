import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import SpaceBackground from '@/components/SpaceBackground';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pathfinders — ARK Academy',
  description: 'A gamified social-emotional learning portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <SpaceBackground />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
