
'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User } from '@/lib/types';

/**
 * A hook to fetch a user's profile from Firestore.
 * @param uid The user's unique ID.
 * @returns The user's profile data, loading state, and any errors.
 */
export function useUserProfile(uid: string | undefined) {
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!uid || !firestore) return null;
    return doc(firestore, 'users', uid);
  }, [uid, firestore]);

  const { data, isLoading, error } = useDoc<User>(userDocRef);

  return { userProfile: data, isLoading, error };
}
