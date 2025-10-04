"use client";

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import LoadingSpinner from '@/components/loading-spinner';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading, isNewUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If no user, redirect to login page, but only if not already there.
        if (pathname !== '/login') {
          router.push('/login');
        }
      } else if (isNewUser && pathname !== '/onboarding') {
        // If it's a new user, they must complete onboarding.
        router.push('/onboarding');
      }
    }
  }, [user, loading, isNewUser, router, pathname]);

  // While loading, or if redirection is imminent, show a spinner.
  if (loading || !user || (isNewUser && pathname !== '/onboarding')) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }
  
  // If user is authenticated and (if new) on the onboarding page, render the children.
  return <>{children}</>;
}
