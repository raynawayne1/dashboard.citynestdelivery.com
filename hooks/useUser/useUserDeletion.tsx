import { useState, useEffect } from 'react';
import { doc, getDoc, deleteDoc, onSnapshot } from 'firebase/firestore';  // Firestore functions
import { toast } from 'react-toastify';  // For error handling and feedback
import { FirebaseError } from 'firebase/app'; // For Firebase errors
import { db } from '../../db/firebase';
import { getAuth, deleteUser } from 'firebase/auth';  // Firebase Authentication functions
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler'; // Custom error handler

export default function useUserDeletion(userId: string) {
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

    // Function to delete user account (Only if the logged-in user is an admin)
    const deleteUserAccount = async () => {
        if (!userId) return;  // If no userId, do nothing

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                toast.error("You must be logged in to delete a user.");
                return;
            }

            // Check if the current user is an admin by fetching their role from Firestore
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));  // Get the logged-in user document
            if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
                setError("You don't have permission to delete this user.");
                setIsLoadingUser(false);
                return;
            }

            // If the current user is an admin, proceed with deletion
            const userToDeleteDocRef = doc(db, 'users', userId);

            // First, delete the user document from Firestore
            await deleteDoc(userToDeleteDocRef);  // Delete the user document from Firestore
            toast.success("User deleted from Firestore.");

            // Delete the user from Firebase Authentication
            // The admin can only delete themselves from Firebase Authentication
            if (currentUser.uid !== userId) {
                toast.error("Only the logged-in user can delete their own account.");
                return;
            }

            // Proceed to delete the user from Firebase Authentication if it's the currently logged-in user
            await deleteUser(currentUser);  // Delete the currently authenticated user from Firebase Authentication
            toast.success("Your account has been deleted.");

            // Clear the user state after deletion
            setUser(null);
        } catch (err) {
            if (err instanceof FirebaseError) {
                FirestoreErrorHandler(err);  // Handle Firestore errors
            } else {
                toast.error("An error occurred while deleting the account.");
            }
        }
    };

    return { user, isLoadingUser, error, deleteUserAccount };  // Return user, loading, error, and delete function
}
