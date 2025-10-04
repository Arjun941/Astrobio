"use client";

import { useContext } from 'react';
import { AuthContext } from '@/context/auth-provider';

export interface UserProfile {
  age: number;
  experienceLevel: 'Novice' | 'Student' | 'Professional';
  learningStyle: 'Text' | 'Visual' | 'Audio';
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
