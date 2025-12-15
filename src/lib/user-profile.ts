'use client';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Firestore,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

export const createUserProfileDocument = async (
  firestore: Firestore,
  userAuth: User
) => {
  const userRef = doc(firestore, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        id: userAuth.uid,
        uid: userAuth.uid,
        name: displayName,
        email,
        profilePhotoUrl: photoURL,
        loginProvider: userAuth.providerData[0]?.providerId || 'password',
        createdAt,
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }

  return userRef;
};
