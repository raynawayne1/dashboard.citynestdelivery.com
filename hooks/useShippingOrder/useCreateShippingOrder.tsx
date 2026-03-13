import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { db } from "../../db/firebase";
import { FirestoreErrorHandler } from "../../Authcontext/FirestoreErrorHandler";
import { IShippingPayload } from "@/components/Interface";
import { generateShippingOrderEmail } from "@/utils/generateShippingOrderEmail";
import { sendEmailNotification } from "@/utils/emailService";
import { useAuth } from "../../Authcontext/AuthContext"; // Assuming you have useAuth hook

function useCreateShippingOrder() {
    const [isCreatingShippingOrder, setIsCreatingShippingOrder] = useState<boolean>(false);
    const { user } = useAuth();

    // Admin check helper
    async function checkIfAdmin(): Promise<boolean> {
        if (!user) {
            toast.error("You must be logged in to create shipping orders.");
            return false;
        }
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data()?.role === "admin") {
                return true;
            } else {
                toast.error("Only admins can create shipping orders.");
                return false;
            }
        } catch (error) {
            toast.error("Failed to verify user role. Please try again.");
            return false;
        }
    }

    // Now accept base64 strings directly, not IUploadImage[]
    async function handleUseCreateShippingOrder(data: IShippingPayload) {
        const isAdmin = await checkIfAdmin();
        if (!isAdmin) return false;

        try {
            setIsCreatingShippingOrder(true);
            const payload = {
                ...data,
                created_At: Timestamp.now(),
                updated_At: Timestamp.now(),
            } as any;

            await addDoc(collection(db, "shippingOrders"), payload);

            // Generate the email content using the response data
            const html = generateShippingOrderEmail(
                data.receiverName,
                data.TrackingId,
                data.receiverAddres,
                data.deliveryDate
            );

            const subject = "We would like to inform you that your shipment has been updated";
            const text = `Dear ${data.receiverName}, we would like to inform you that your shipment has been updated.`;

            // Send the email notification
            try {
                await sendEmailNotification({
                    to: data.receiverEmail, // use email here
                    subject,
                    text,
                    html,
                });
            } catch (error) {
                console.error("Error sending email:", error);
            }

            toast.success("Successfully created shipping order");
            return true;
        } catch (error) {
            if (error instanceof FirebaseError) {
                FirestoreErrorHandler(error);
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
            return false;
        } finally {
            setIsCreatingShippingOrder(false);
        }
    }

    return {
        isCreatingShippingOrder,
        handleUseCreateShippingOrder,
    };
}

export default useCreateShippingOrder;
