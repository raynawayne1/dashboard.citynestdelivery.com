import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../db/firebase"; // Adjust path as needed
import { toast } from "react-toastify";
import { useAuth } from "../../Authcontext/AuthContext";

function useDeleteDropLocation(
  shippingId: string | undefined,
  dropLocationIndex: number | undefined
) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const checkIfAdmin = async (): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return false;
    }
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data()?.role === "admin") {
        return true;
      } else {
        toast.error("You don't have permission to perform this action.");
        return false;
      }
    } catch {
      toast.error("Failed to verify user role.");
      return false;
    }
  };

  async function handleDeleteDropLocation() {
    if (!shippingId || dropLocationIndex === undefined) {
      toast.error("Missing shippingId or drop location index");
      return false;
    }

    setIsDeleting(true);
    setError(null);

    const isAdmin = await checkIfAdmin();
    if (!isAdmin) {
      setIsDeleting(false);
      return false;
    }

    try {
      const docRef = doc(db, "shippingOrders", shippingId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Shipping order not found");
        setIsDeleting(false);
        return false;
      }

      const dropsArray = docSnap.data().shippingDrops || [];

      if (dropLocationIndex < 0 || dropLocationIndex >= dropsArray.length) {
        toast.error("Drop location index out of range");
        setIsDeleting(false);
        return false;
      }

      // Remove the drop location at dropLocationIndex
      const updatedDrops = dropsArray.filter(
        (_: any, index: number) => index !== dropLocationIndex
      );

      await updateDoc(docRef, { shippingDrops: updatedDrops });

      toast.success("Successfully deleted drop location");
      setIsDeleting(false);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete drop location");
      setIsDeleting(false);
      setError(err.message || "Failed to delete drop location");
      return false;
    }
  }

  return {
    isDeleting,
    error,
    handleDeleteDropLocation,
  };
}

export default useDeleteDropLocation;
