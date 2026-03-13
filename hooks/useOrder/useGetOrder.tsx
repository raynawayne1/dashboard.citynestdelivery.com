import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../../Authcontext/AuthContext';
import { db } from '../../db/firebase';
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler';

export default function useGetOrder(orderId: string) {
    const [order, setOrder] = useState<any>(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(true);
    const { user } = useAuth();  // Get the logged-in user
    const [errorMessage, setErrorMessage] = useState<string | null>(null);  // Store the error message

    useEffect(() => {
        if (!user?.uid || !orderId) return;

        setIsLoadingOrder(true); // Start loading

        const checkUserPermissions = async () => {
            try {
                // Fetch user document
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    toast.error('User not found!');
                    setOrder(null);
                    setIsLoadingOrder(false);
                    return;
                }

                const userData = userDoc.data();
                const isAdmin = userData?.role === 'admin';  // Check if the user is an admin
                const userOrders = userData?.orders;

                // Adding email and fullName to the order data for both admins and users
                const email = userData?.email;
                const fullName = userData?.fullName;

                // ** Admin Case **
                if (isAdmin) {
                    let foundOrder = null;
                    const allUsersQuery = await getDocs(collection(db, 'users'));

                    // Loop through all users' orders to find the requested orderId
                    for (const userSnap of allUsersQuery.docs) {
                        const orders = userSnap.data()?.orders;
                        if (Array.isArray(orders)) {
                            foundOrder = orders.find((order: any) => order.id === orderId);
                            if (foundOrder) break;  // If we find the order, stop the loop
                        }
                    }

                    if (foundOrder) {
                        // Add the user info (email and fullName) to the order data
                        foundOrder.email = email;
                        foundOrder.fullName = fullName;
                        setOrder(foundOrder);
                    } else {
                        toast.error('Order not found!');
                        setOrder(null);
                    }
                    setIsLoadingOrder(false);
                    return;
                }

                // ** Regular User Case **
                if (user.uid !== userDoc.id) {
                    toast.error('You do not have permission to access this order!');
                    setOrder(null);
                    setIsLoadingOrder(false);
                    return;
                }

                // Check if the orderId exists in the user's own orders
                const foundOrder = userOrders?.find((order: any) => order.id === orderId);
                if (foundOrder) {
                    // Add the user info (email and fullName) to the order data
                    foundOrder.email = email;
                    foundOrder.fullName = fullName;
                    setOrder(foundOrder);
                } else {
                    toast.error('Order not found!');
                    setOrder(null);
                }

                setIsLoadingOrder(false);
            } catch (error) {
                if (error instanceof FirebaseError) {
                    FirestoreErrorHandler(error);
                } else {
                    toast.error('An unexpected error occurred. Please try again later.');
                }
                setIsLoadingOrder(false);
            }
        };

        checkUserPermissions();

    }, [user?.uid, orderId]);

    return { order, isLoadingOrder, errorMessage };
}
