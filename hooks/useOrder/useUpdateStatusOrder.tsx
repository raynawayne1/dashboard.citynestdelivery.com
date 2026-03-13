import { useAuth } from '../../Authcontext/AuthContext';
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler';
import { ICreateOrder } from '@/components/Interface';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../db/firebase';

function useUpdateStatusOrder() {
    const [isUpdatingOrderStatus, setIsUpdatingOrderStatus] = useState<boolean>(false);
    const [isUpdatedStatus, setIsUpdatedStatus] = useState<string>("");
    const { user } = useAuth();

    // Function to check if the logged-in user is an admin
    const checkIfAdmin = async () => {
        try {
            const docRef = doc(db, "users", user.uid); // Reference to the logged-in user's document
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userRole = docSnap.data()?.role; // Access the role field from Firestore
                return userRole === 'admin'; // If the role is admin, return true
            }
            return false;
        } catch (error) {
            console.error("Error checking user role", error);
            return false;
        }
    };

    // Function to update the order status
    async function handleUseUpdateOrder(data: ICreateOrder, orderId: string) {
        try {
            setIsUpdatingOrderStatus(true);

            // Check if the user is an admin
            const isAdmin = await checkIfAdmin();

            if (!isAdmin) {
                // If the user is not an admin, they cannot update any orders (even their own)
                toast.error("You do not have permission to update orders.");
                setIsUpdatingOrderStatus(false);
                return;
            }

            // If the user is an admin, they can update any user's order
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(usersRef); // Get all users' documents

            let orderFound = false; // Flag to track if the order is found and updated

            // Search through all users' orders for the given orderId
            for (const docSnap of querySnapshot.docs) {
                const userDoc = docSnap.data();
                let orders = userDoc?.orders;

                // Ensure orders is an array before attempting to use map
                if (Array.isArray(orders)) {
                    const updatedOrders = orders.map((order: ICreateOrder) => {
                        if (order.id === orderId && !orderFound) {
                            orderFound = true; // Mark the order as found
                            return { ...order, status: data.status }; // Update the order
                        }
                        return order;
                    });

                    // If the order was found, update the user's document and stop further iterations
                    if (orderFound) {
                        await updateDoc(docSnap.ref, {
                            orders: updatedOrders,
                        });
                        setIsUpdatedStatus(data.status);
                        toast.success("Successfully updated the order status!");
                        break; // Stop iterating once the order is updated
                    }
                }
            }

            if (!orderFound) {
                toast.error("Order not found in any user document!");
            }

            setIsUpdatingOrderStatus(false);
        } catch (error) {
            if (error instanceof FirebaseError) {
                FirestoreErrorHandler(error);
                setIsUpdatingOrderStatus(false);
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
                setIsUpdatingOrderStatus(false);
            }
        }
    }

    return {
        isUpdatingOrderStatus,
        isUpdatedStatus,
        handleUseUpdateOrder,
    };
}

export default useUpdateStatusOrder;
