import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';  // For Firebase errors
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler';  // Handle errors
import { db } from '../../db/firebase';
import { getAuth, updatePassword, sendPasswordResetEmail } from 'firebase/auth';  // Import Firebase Auth methods
import { doc, onSnapshot } from 'firebase/firestore';

interface UseEditPasswordProps {
    userId: string;
}

export default function useEditPassword({ userId }: UseEditPasswordProps) {
    const [user, setUser] = useState<any>(null);  // User data state
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);  // Loading state
    const [error, setError] = useState<string | null>(null);  // Error state
    const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);  // Password update loading state
    const [isFederatedUser, setIsFederatedUser] = useState<boolean>(false);  // Whether the user signed in with a federated provider like Google

    const auth = getAuth();

    useEffect(() => {
        if (!userId) return;  // If no userId is provided, return early

        const unsubscribe = onSnapshot(
            doc(db, 'users', userId),  // Reference to the user document in Firestore
            (docSnap) => {
                if (docSnap.exists()) {
                    setUser(docSnap.data());  // Set the user data when the document exists
                    setIsLoadingUser(false);  // Stop loading
                    const currentUser = auth.currentUser;

                    // Check if the user is signed in with Google (or another federated provider)
                    const isFederated = currentUser?.providerData.some(
                        (provider) => provider.providerId === 'google.com'
                    ) ?? false;  // Ensure isFederated is a boolean, defaulting to false

                    setIsFederatedUser(isFederated);  // Set the federated user state
                } else {
                    toast.error('User not found!');
                    setIsLoadingUser(false);  // Stop loading if user is not found
                }
            },
            (error) => {
                if (error instanceof FirebaseError) {
                    FirestoreErrorHandler(error);  // Handle Firestore errors
                } else {
                    toast.error('An unexpected error occurred. Please try again later.');
                }
                setIsLoadingUser(false);  // Stop loading on error
            }
        );

        // Cleanup listener when the component unmounts or the userId changes
        return () => unsubscribe();
    }, [userId]);

    // Function to handle password update
    const handlePasswordUpdate = async (newPassword: string, confirmPassword: string) => {
        console.log('New Password:', newPassword);
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }

        if (isUpdatingPassword) return;  // Prevent multiple submissions

        setIsUpdatingPassword(true);  // Start loading state

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error('User not authenticated.');
                return;
            }

            // If the user is federated (e.g., Google), send a password reset email
            if (isFederatedUser) {
                await sendPasswordResetEmail(auth, currentUser.email as string);
                toast.success('A password reset email has been sent.');
            } else {
                // If the user is a regular email/password user, update their password
                await updatePassword(currentUser, newPassword);
                toast.success('Password updated successfully.');
            }

            // Clear the password fields after success
            // Here you can clear your form or reset any local state variables if needed
            // setNewPassword('');
            // setConfirmPassword('');

        } catch (error) {
            console.error('Error during password update:', error);
            if (error instanceof FirebaseError) {
                FirestoreErrorHandler(error);  // Handle Firestore errors
            } else {
                toast.error('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsUpdatingPassword(false);  // Reset loading state
        }
    };

    return {
        user,
        isLoadingUser,
        error,
        isUpdatingPassword,
        handlePasswordUpdate,  // Return the function that accepts the form data
    };
}
