import { useState } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from '../../db/firebase';
import { useAuth } from '../../Authcontext/AuthContext';
import { toast } from 'react-toastify';

export default function useDeleteShippingOrder() {
  const { user } = useAuth();
  const [isDeletingShippingOrder, setIsDeletingShippingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const checkIfAdmin = async (): Promise<boolean> => {
    if (!user) {
      setError("You must be logged in to delete a shipping order.");
      return false;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data()?.role === 'admin') {
        return true;
      } else {
        setError("You don't have permission to delete shipping orders.");
        return false;
      }
    } catch (err) {
      setError("An error occurred while checking user role.");
      return false;
    }
  };

  // Function to delete shipping order by ID
  const handleDeleteShippingOrder = async (shippingOrderId: string | null) => {
    if (!shippingOrderId) {
      setError("No shipping order ID provided.");
      return;
    }

    setIsDeletingShippingOrder(true);
    setError(null);

    const isAdmin = await checkIfAdmin();
    if (!isAdmin) {
      setIsDeletingShippingOrder(false);
      return;
    }

    try {
      const orderDocRef = doc(db, 'shippingOrders', shippingOrderId);
      await deleteDoc(orderDocRef);
      toast.success("Shipping order deleted successfully.");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(`Error deleting shipping order: ${err.message}`);
      } else if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unexpected error occurred while deleting the shipping order.');
      }
      toast.error(error || "Failed to delete shipping order.");
    } finally {
      setIsDeletingShippingOrder(false);
    }
  };

  return { handleDeleteShippingOrder, isDeletingShippingOrder, error };
}
