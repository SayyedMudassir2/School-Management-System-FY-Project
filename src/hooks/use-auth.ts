
// src/hooks/use-auth.ts
'use client';

import { useState, useEffect } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';

export function useAuth() {
  const { app } = useFirebase();
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);
  
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

  return { user, loading, error, signInWithEmail, auth };
}

export function useCurrentUser() {
  const { auth, user, loading } = useAuth();

  const updateUserProfile = async (displayName: string) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    await updateProfile(auth.currentUser, { displayName });
  };
  
  const reauthenticate = async (password: string) => {
    if (!auth.currentUser || !auth.currentUser.email) throw new Error("Not authenticated");
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const changeUserPassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    await updatePassword(auth.currentUser, newPassword);
  };

  return { user, loading, updateUserProfile, changeUserPassword, reauthenticate };
}
