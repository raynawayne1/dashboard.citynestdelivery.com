import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler';
import { FirebaseError } from 'firebase/app';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../db/firebase';
import { useAuth } from '../../Authcontext/AuthContext';

export default function useGetAllAdmins(): { admins: any[], isLoadingAdmins: boolean, currentUserId: string } {
    const [isLoadingAdmins, setIsLoadingAdmins] = useState<boolean>(true);
    const [admins, setAdmins] = useState<any[]>([]);
    const { userRole, user, loading } = useAuth();
    
    // Ensure currentUserId is always a string, fallback to an empty string if undefined
    const currentUserId = user?.uid || ""; // Default to an empty string if not available

    useEffect(() => {
        // Ensure the user is logged in and is an admin
        if (!user || userRole !== 'admin') {
            toast.error("You must be an admin to view this data.");
            setIsLoadingAdmins(false);
            return;
        }

        // If the user is an admin, proceed with fetching the list of all admins
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "admin"));

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const adminsList = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore timestamps to JavaScript Date objects
                    const createdAt = data.createdAt ? new Date(data.createdAt.seconds * 1000) : null;
                    const updatedAt = data.updatedAt ? new Date(data.updatedAt.seconds * 1000) : null;

                    return {
                        id: doc.id,
                        ...data,
                        createdAt,
                        updatedAt
                    };
                });

                setAdmins(adminsList);
                setIsLoadingAdmins(false);
            },
            (error) => {
                if (error instanceof FirebaseError) {
                    FirestoreErrorHandler(error);
                    setIsLoadingAdmins(false);
                } else {
                    toast.error("An unexpected error occurred. Please try again later.");
                    setIsLoadingAdmins(false);
                }
            }
        );

        return () => unsubscribe();
    }, [currentUserId, userRole]); // Depend on currentUserId and userRole to refetch if these change

    return { admins, isLoadingAdmins, currentUserId };
}
