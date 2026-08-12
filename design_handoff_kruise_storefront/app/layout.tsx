import type { Metadata } from 'next';
import './globals.css';
import { KruiseCartProvider } from '../components/KruiseCartProvider';
import { KruiseCartDrawer } from '../components/KruiseCartDrawer';
import { KruiseSiteHeader } from '../components/KruiseSiteHeader';
import { KruiseSiteFooter } from '../components/KruiseSiteFooter';

export const metadata: Metadata = {
  title: 'Kruise — Smells like summer',
  description: 'Car air fresheners that smell like a candy store. Collect all seven.',
};

export default function rootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KruiseCartProvider>
          <KruiseSiteHeader />
          {children}
          <KruiseSiteFooter />
          <KruiseCartDrawer />
        </KruiseCartProvider>
      </body>
    </html>
  );
}
