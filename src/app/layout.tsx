import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { CleanHeader } from '@/components/layout/clean-header';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'AstroBio Navigator',
  description: 'An AI-powered knowledge engine for space biology research.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CleanHeader />
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
