import { useState } from 'react';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';
import { db } from '../../db/firebase';
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler';
import { useAuth } from '../../Authcontext/AuthContext';
import { ICreateOrder } from '@/components/Interface';

export default function useDeleteOrder() {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { user } = useAuth(); // Get the logged-in user

    const HandledeleteOrder = async (orderId: string) => {
        if (!user?.uid) {
            toast.error('You must be logged in to delete an order!');
            return;
        }

        setIsDeleting(true); // Start loading

        try {
            // Fetch the current user's document to check if the user is an admin
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                toast.error('User not found!');
                setIsDeleting(false);
                return;
            }

            const userData = userDoc.data();
            const isAdmin = userData?.role === 'admin'; // Check if the logged-in user is an admin

            if (!isAdmin) {
                toast.error('You do not have permission to delete orders.');
                setIsDeleting(false);
                return;
            }

            // Fetch all users' orders (we will merge the orders from all users)
            const usersCollectionRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollectionRef);
            const allOrders: ICreateOrder[] = [];
            const userOrderMap: { [key: string]: string } = {}; // To keep track of which user's orders we are deleting

            // Iterate over all users and collect orders
            usersSnapshot.forEach((docSnapshot) => {
                const user = docSnapshot.data();
                const orders = user.orders || [];
                allOrders.push(...orders); // Merge all orders
                // Map orders to the corresponding user ID
                orders.forEach((order: ICreateOrder) => {
                    userOrderMap[order.id] = docSnapshot.id;
                });
            });

            // Find the order with the provided orderId
            const orderToDelete = allOrders.find((order: ICreateOrder) => order.id === orderId);

            if (!orderToDelete) {
                toast.error('Order not found!');
                setIsDeleting(false);
                return;
            }

            // Get the user ID who owns this order
            const userId = userOrderMap[orderId];

            // Fetch the user's document who owns the order
            const targetUserDocRef = doc(db, 'users', userId);
            const targetUserDoc = await getDoc(targetUserDocRef);

            if (!targetUserDoc.exists()) {
                toast.error('Target user not found!');
                setIsDeleting(false);
                return;
            }

            // Get the user's orders and remove the order to delete
            const targetUserData = targetUserDoc.data();
            const updatedOrders = targetUserData?.orders.filter((order: ICreateOrder) => order.id !== orderId);

            // Update the user's orders field in Firestore (remove the order)
            await updateDoc(targetUserDocRef, { orders: updatedOrders });

            toast.success('Order successfully deleted!');
            setIsDeleting(false);

        } catch (error) {
            if (error instanceof FirebaseError) {
                FirestoreErrorHandler(error);
            } else {
                toast.error('An unexpected error occurred. Please try again later.');
            }
            setIsDeleting(false);
        }
    };

    return { HandledeleteOrder, isDeleting };
}
