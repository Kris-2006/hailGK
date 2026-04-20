import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import { AuthProvider } from '@/lib/auth';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'CDC Recruitment Portal — IIT (ISM) Dhanbad',
  description: 'Career Development Centre — Recruitment Portal for campus placements at IIT (ISM) Dhanbad. Submit JNF and INF forms for campus recruitment.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthProvider>
                {children}
              </AuthProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  );
}
