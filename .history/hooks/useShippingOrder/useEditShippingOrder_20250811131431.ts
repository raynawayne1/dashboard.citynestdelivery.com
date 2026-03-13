import { doc, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { db } from "../../db/firebase";
import { FirestoreErrorHandler } from "../../Authcontext/FirestoreErrorHandler";
import { useAuth } from "../../Authcontext/AuthContext";
import { IShippingPayload } from "@/components/Interface";

function useEditShippingOrder() {
  const { user } = useAuth();
  const [isEditingShippingOrder, setIsEditingShippingOrder] = useState(false);

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

  async function handleUseEditShippingOrder(id: string, data: IShippingPayload) {
    const isAdmin = await checkIfAdmin();
    if (!isAdmin) return false;

    try {
      setIsEditingShippingOrder(true);

      const payload = {
        ...data,
        updated_At: Timestamp.now(),
      } as any;

      await updateDoc(doc(db, "shippingOrders", id), payload);

      toast.success("Successfully updated shipping order");
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
