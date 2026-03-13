import { ICommentText, ICreateOrder, ILink, IQuantity, IUsername } from '@/components/Interface';
import { FirebaseError } from 'firebase/app';
import { arrayUnion, doc, getDoc, runTransaction, collection, getDocs, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../db/firebase';
import { useAuth } from '../../Authcontext/AuthContext';
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler';
import { generateOrderEmailHtml } from '@/utils/generateOrderEmailHtml';
import { sendEmailNotification } from '@/utils/emailService';
import { useRouter } from "next/navigation";

function generateUniqueOrderId(): string {
    const timestamp = Date.now();  // Get the current timestamp in milliseconds
    const randomNum = Math.floor(Math.random() * 1000);  // Generate a random number between 0 and 999
    const orderId = `${timestamp}${randomNum}`.slice(-8);  // Combine timestamp and random number, and slice the last 8 digits
    return orderId;
}

function useCreateOrder() {
    const [isCreatingOrder, setIsCreatingOrdery] = useState<boolean>(false);
    const orderId = generateUniqueOrderId();  // Generate the unique order ID here
    const { user, loading } = useAuth();
    const router = useRouter();

    async function deleteExistingOrders() {
        if (!user?.uid) return;

        try {
            const ordersCollectionRef = collection(db, "users", user.uid, "orders");
            const ordersSnapshot = await getDocs(ordersCollectionRef);
            ordersSnapshot.forEach(async (docSnap) => {
                await deleteDoc(doc(db, "users", user.uid, "orders", docSnap.id)); // Delete each order document
            });
            toast.success("All existing orders have been deleted.");
        } catch (error) {
            if (error instanceof FirebaseError) {
                FirestoreErrorHandler(error);
            } else {
                toast.error("An unexpected error occurred while deleting orders.");
            }
        }
    }

    async function handleUseCreateOrder(
        data: ICreateOrder,
        setLink: (val: ILink) => void,
        setUserName: (val: IUsername) => void,
        setCommentText: (val: ICommentText) => void,
        setQuantity: (val: IQuantity) => void
    ) {
        try {
            setIsCreatingOrdery(true);

            const docRef = doc(db, "users", user.uid);
            const charge = (data.amount / data.per) * data.quantity;

            // Start a Firestore transaction to handle balance and orders atomically
            await runTransaction(db, async (transaction) => {
                const docSnap = await transaction.get(docRef);

                if (!docSnap.exists()) {
                    throw new Error("User document does not exist!");
                }

                const userData = docSnap.data();
                const currentBalance = userData.balance || 0;

                // Check if the user has enough balance to cover the charge
                if (currentBalance < charge) {
                    // Gracefully handle the insufficient balance case and abort the transaction
                    toast.error("Insufficient balance to create the order.");
                    router.push("/admin/payment");
                    return; // Exit early to prevent further execution of the transaction
                }

                // Update the user's balance
                const newBalance = currentBalance - charge;
                const newOrder = {
                    ...data,
                    createdAt: Timestamp.fromMillis(Date.now()),  // Use Firestore Timestamp instead of Date.now()
                    updatedAt: Timestamp.fromMillis(Date.now()),
                    id: orderId,  // Use the generated unique order ID
                    email: userData.email,
                    fullName: userData.fullName,
                    charge: charge, // Store the charge in the order data
                };

                // Update the user's orders and balance atomically in Firestore
                await transaction.update(docRef, {
                    orders: arrayUnion(newOrder),
                    balance: newBalance,  // Update balance atomically
                });


                //  Generate the email content using the response data
                const html = generateOrderEmailHtml(
                    newOrder.serviceName,
                    newOrder.email,
                    newOrder.id,
                    newOrder.quantity,
                    newOrder.amount,
                    newOrder.averageTime,
                    newOrder.status,
                    newOrder.charge,
                    Date.now() as any,
                    newOrder.link,
                    newOrder.username
                );

                const subject = "Order Successful";
                const text = `Dear ${newOrder.fullName}, your order  successful.`;

                // Send the email notification
                try {
                    await sendEmailNotification({
                        to: user.email,
                        subject,
                        text,
                        html,
                    });
                } catch (error) {
                }


                // Only after the transaction is successful, show success message
                toast.success("Successfully created order");
            });

            // Reset form fields after the transaction is successful
            setLink({ link: "", isTouch: false, isValidUrl: false });
            setUserName({ username: "", isTouch: false });
            setCommentText({ commentText: "", isTouch: false });
            setQuantity({ quantity: 0, isTouch: false, error: true, message: "Quantity is required!!" });

        } catch (error) {
            if (error instanceof Error) {
                // TypeScript now knows error is an instance of Error
                toast.error(error.message || "An unexpected error occurred. Please try again later.");
            } else {
                // Handle case when error is not of type Error
                toast.error("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setIsCreatingOrdery(false);
        }
    }

    return {
        isCreatingOrder,
        handleUseCreateOrder,
        deleteExistingOrders,  // Expose deleteExistingOrders to be used in the component
    };
}

export default useCreateOrder;
