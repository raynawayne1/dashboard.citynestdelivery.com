import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';  // Import onSnapshot
import { toast } from 'react-toastify';  // For error handling
import { FirebaseError } from 'firebase/app'; // For Firebase errors
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler';
import { db } from '../../db/firebase';

export default function useUserById(userId: string) {
  const [user, setUser] = useState<any>(null);  // User data state
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  useEffect(() => {
    if (!userId) return;  // If no userId is provided, return early

    const userDocRef = doc(db, 'users', userId);  // Reference to the user document in Firestore

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data());  // Set the user data when the document exists
          setIsLoadingUser(false);  // Stop loading
        } else {
          toast.error("User not found!");
          setIsLoadingUser(false);  // Stop loading if user is not found
        }
      },
      (error) => {
        if (error instanceof FirebaseError) {
          FirestoreErrorHandler(error);  // Handle Firestore errors
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
        setIsLoadingUser(false);  // Stop loading on error
      }
    );

    // Cleanup listener when the component unmounts or the userId changes
    return () => unsubscribe();
  }, [userId]);  // Re-fetch when userId changes

  return { user, isLoadingUser, error };  // Return user, loading, and error states
}
