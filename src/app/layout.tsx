import NavWrapper from '@/components/navigation/nav-wrapper';
import ErrorFallback from '@/components/providers/error-boundary';
import IntlProvider from '@/components/providers/intl-provider';
import MediaQueryProvider from '@/components/providers/media-query-provider';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { getLocale, getMessages } from 'next-intl/server';
import { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="small-scrollbar">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <IntlProvider messages={messages} locale={locale}>
              <MediaQueryProvider>
                <ReactQueryProvider>
                  <NavWrapper />
                  {/* <ViewTransitions> */}
                  <div className="pt-14">{children}</div>
                  {/* </ViewTransitions> */}
                  <Analytics />
                  <SpeedInsights />
                  <Toaster richColors />
                </ReactQueryProvider>
              </MediaQueryProvider>
            </IntlProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'mktour',
  description: 'web app for managing complex tournaments of all kind',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    startupImage: '/icon.png',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'mktour',
    description: 'making tournaments the easy way',
    url: 'https://mktour.org',
    siteName: 'mktour.org',
    images: [
      {
        url: 'public/icon.png',
        width: 98,
        height: 98,
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default RootLayout;
