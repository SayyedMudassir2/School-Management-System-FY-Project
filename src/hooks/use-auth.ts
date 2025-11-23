
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
  
  const signInWithEmail = (email: string, password: string): Promise<User> => {
    setError(null);
    // Return the promise without awaiting it here
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          setUser(userCredential.user);
          resolve(userCredential.user);
        })
        .catch(error => {
          setError(error.message);
          reject(error);
        });
    });
  };

  return { user, loading, error, signInWithEmail, auth };
}

export function useCurrentUser() {
  const { auth, user, loading } = useAuth();

  const updateUserProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    await updateProfile(auth.currentUser, profileData);
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
