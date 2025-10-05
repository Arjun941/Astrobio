import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { CleanHeader } from '@/components/layout/clean-header';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { InitialLoaderHandler } from '@/components/initial-loader-handler';

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
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Initial loading styles - applied immediately */
            html, body {
              background-color: #0a0a0a !important;
              color: #fafafa !important;
              margin: 0;
              padding: 0;
            }
            
            /* Loading spinner for initial load */
            #initial-loader {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background-color: #0a0a0a;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            }
            
            .initial-spinner {
              width: 32px;
              height: 32px;
              border: 2px solid #22c55e;
              border-top: 2px solid transparent;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <div id="initial-loader">
          <div className="initial-spinner"></div>
        </div>
        <FirebaseClientProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <InitialLoaderHandler />
              <CleanHeader />
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </FirebaseClientProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Hide initial loader once React has loaded
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() {
                const loader = document.getElementById('initial-loader');
                if (loader) {
                  loader.style.opacity = '0';
                  loader.style.transition = 'opacity 0.3s ease-out';
                  setTimeout(() => {
                    loader.style.display = 'none';
                  }, 300);
                }
              }, 100);
            });
          `
        }} />
      </body>
    </html>
  );
}
