import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../db/firebase"; // Adjust path if needed
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export type DropData = {
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  status: string;
  date: string;
  remarks: string;
};

// Waits for auth state and checks admin role
async function checkIsAdmin(userId?: string): Promise<boolean> {
  // If no userId passed, try to get current logged-in user
  if (!userId) {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      // Wait for auth state to resolve (prevents false errors on mount)
      await new Promise<void>((resolve) => {
        const unsub = onAuthStateChanged(auth, (user) => {
          unsub();
          if (user) {
            userId = user.uid;
          }
          resolve();
        });
      });
    } else {
      userId = currentUser.uid;
    }
  }

  if (!userId) {
    toast.error("You must be logged in to perform this action.");
    return false;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists() && userDoc.data()?.role === "admin") {
      return true;
    }
    toast.error("You don't have permission to perform this action.");
    return false;
  } catch {
    toast.error("Failed to verify user role.");
    return false;
  }
}

function useEditAddDropLocation(
  shippingId: string,
  editDropId: number,
  userId?: string
) {
  const [loading, setLoading] = useState(true);
  const [dropData, setDropData] = useState<DropData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingEditDropLocation, setIsUpdatingEditDropLocation] =
    useState(false);

  // Fetch the drop location data
  useEffect(() => {
    if (!shippingId || editDropId === undefined) {
      setError("Missing shippingId or editDropId");
      setLoading(false);
      return;
    }

    async function fetchDrop() {
      setLoading(true);
      try {
        const docRef = doc(db, "shippingOrders", shippingId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Shipping order not found");
          setDropData(null);
          setLoading(false);
          return;
        }

        const dropsArray = docSnap.data().shippingDrops;
        if (!dropsArray || !dropsArray[editDropId]) {
          setError("Drop location to edit not found");
          setDropData(null);
          setLoading(false);
          return;
        }

        setDropData(dropsArray[editDropId]);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch drop");
        setLoading(false);
      }
    }

    fetchDrop();
  }, [shippingId, editDropId]);

  // Update drop location
  async function handleEditDropLocation(updatedData: DropData) {
    if (!shippingId || editDropId === undefined) {
      toast.error("Missing shippingId or editDropId");
      return false;
    }

    if (!(await checkIsAdmin(userId))) {
      return false;
    }

    setIsUpdatingEditDropLocation(true);
    setError(null);

    try {
      const docRef = doc(db, "shippingOrders", shippingId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Shipping order not found");
        setIsUpdatingEditDropLocation(false);
        return false;
      }

      const dropsArray = docSnap.data().shippingDrops || [];
      const updatedDrops = dropsArray.map((drop: DropData, index: number) =>
        index === editDropId ? updatedData : drop
      );

      await updateDoc(docRef, { shippingDrops: updatedDrops });

      toast.success("Successfully edited shipping drop");
      setIsUpdatingEditDropLocation(false);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update drop");
      setIsUpdatingEditDropLocation(false);
      return false;
    }
  }

  return {
    loading,
    dropData,
    error,
    isUpdatingEditDropLocation,
    handleEditDropLocation,
  };
}

export default useEditAddDropLocation;
