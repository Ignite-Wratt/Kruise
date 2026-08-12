import type { Metadata } from 'next';
import './globals.css';
import { KruiseCartProvider } from '../components/KruiseCartProvider';
import { KruiseCartDrawer } from '../components/KruiseCartDrawer';
import { KruiseV2Header } from '../components/KruiseV2Header';
import { KruiseV2Footer } from '../components/KruiseV2Footer';

export const metadata: Metadata = {
  title: 'Kruise — Smells like summer',
  description: 'Car air fresheners that smell like a candy store. Collect all seven.',
};

export default function rootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KruiseCartProvider>
          <KruiseV2Header />
          {children}
          <KruiseV2Footer />
          <KruiseCartDrawer />
        </KruiseCartProvider>
      </body>
    </html>
  );
}
