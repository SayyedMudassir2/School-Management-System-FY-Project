
// src/hooks/use-auth.ts
'use client';

import { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';

export function useAuth() {
  const { app } = useFirebase();
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, signInWithEmail };
}
