"use client";

import { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import type { UserProfile } from '@/hooks/use-auth';
import LoadingSpinner from '@/components/loading-spinner';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isNewUser: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isNewUser: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
          setIsNewUser(false);
        } else {
          setUserProfile(null);
          setIsNewUser(true);
        }
      } else {
        setUserProfile(null);
        setIsNewUser(false);
      }
      setLoading(false);
    };

    if (!isUserLoading) {
      checkUserProfile();
    }
  }, [user, isUserLoading, firestore]);

  if (loading || isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isNewUser }}>
      {children}
    </AuthContext.Provider>
  );
}
