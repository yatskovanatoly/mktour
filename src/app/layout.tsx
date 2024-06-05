import IntlProvider from '@/components/intl-provider';
import NavbarWrapper from '@/components/navbars/navbar-wrapper';
import ThemeProvider from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { AxiomWebVitals } from 'next-axiom';
import { ViewTransitions } from 'next-view-transitions';
import { PropsWithChildren } from 'react';

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AxiomWebVitals />
      <body className="touch-pan-x touch-pan-y">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IntlProvider>
            <NavbarWrapper />
            <ViewTransitions>
              <div className="pt-14">{children}</div>
            </ViewTransitions>
            <Analytics />
            <SpeedInsights />
            <Toaster richColors />
          </IntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'mktour',
  description: 'an app for managing complex tournaments of all kind',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default RootLayout;
