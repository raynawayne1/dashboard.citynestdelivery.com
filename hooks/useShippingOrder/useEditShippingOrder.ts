import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { db } from "../../db/firebase";
import { FirestoreErrorHandler } from "../../Authcontext/FirestoreErrorHandler";
import { IShippingPayload } from "@/components/Interface";
import { useAuth } from "../../Authcontext/AuthContext";

function useEditShippingOrder() {
  const { user } = useAuth();
  const [isEditingShippingOrder, setIsEditingShippingOrder] = useState<boolean>(false);

  // Check if current user is admin by fetching user doc from Firestore
  const checkIfAdmin = async (): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to edit shipping orders.");
      return false;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data()?.role === "admin") {
        return true;
      } else {
        toast.error("Only admins can edit shipping orders.");
        return false;
      }
    } catch (error) {
      toast.error("Failed to verify user role. Please try again.");
      return false;
    }
  };

  /**
   * @param shippingOrderId string - the id of the order to update
   * @param data IShippingPayload - the new data to update
   * @param reset function - callback to reset form after success (optional)
   */
  async function handleUseEditShippingOrder(
    shippingOrderId: string,
    data: IShippingPayload,
    reset?: () => void
  ) {
    const isAdmin = await checkIfAdmin();
    if (!isAdmin) return false;

    try {
      setIsEditingShippingOrder(true);

      const payload = {
        ...data,
        updated_At: Timestamp.now(),
      } as any;

      const orderDocRef = doc(db, "shippingOrders", shippingOrderId);
      await updateDoc(orderDocRef, payload);

      // Email sending logic (optional, commented out)
      try {
        const templateParams = {
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          receiverName: data.receiverName,
          receiverEmail: data.receiverEmail,
          trackingId: data.TrackingId || "",
          carrierReference: data.carrierReference || "",
        };
        // await emailjs.send("default_service", "template_update_id", templateParams);
      } catch (emailErr) {
        console.error("EmailJS error:", emailErr);
      }

      toast.success("Successfully updated shipping order");
      if (reset) reset();
      return true;
    } catch (error) {
      if (error instanceof FirebaseError) {
        FirestoreErrorHandler(error);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
      return false;
    } finally {
      setIsEditingShippingOrder(false);
    }
  }

  return {
    isEditingShippingOrder,
    handleUseEditShippingOrder,
  };
}

export default useEditShippingOrder;
