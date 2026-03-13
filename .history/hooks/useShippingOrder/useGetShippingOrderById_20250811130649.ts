import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from '../../db/firebase';
import { useAuth } from '../../Authcontext/AuthContext';
import { toast } from 'react-toastify';
import { IShippingPayload } from '@/components/Interface';

export default function useGetShippingOrderById(orderId: string | null) {
  const { user } = useAuth();
  const [shippingOrder, setShippingOrder] = useState<IShippingPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const checkIfAdmin = async (): Promise<boolean> => {
    if (!user) {
      setError("You must be logged in to access this data.");
      setIsLoading(false);
      return false;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data()?.role === 'admin') {
        return true;
      } else {
        setError("You don't have permission to view this data.");
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError("An error occurred while checking user role.");
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      const isAdmin = await checkIfAdmin();
      if (!isAdmin) return;

      try {
        const orderDocRef = doc(db, 'shippingOrders', orderId);
        const orderDocSnap = await getDoc(orderDocRef);

        if (orderDocSnap.exists()) {
          const data = orderDocSnap.data();

          // Map Firestore data to IShippingPayload with fallback values and date conversion
          const mappedOrder: IShippingPayload = {
            senderName: data.senderName || "",
            senderPhone: data.senderPhone || "",
            senderEmail: data.senderEmail || "",
            senderAddres: data.senderAddres || "",
            receiverName: data.receiverName || "",
            receiverPhone: data.receiverPhone || "",
            receiverEmail: data.receiverEmail || "",
            receiverAddres: data.receiverAddres || "",
            description: data.description || "",
            paymentMode: data.paymentMode || "",
            shipmentMode: data.shipmentMode || "",
            weight: data.weight || "",
            carrierReference: data.carrierReference || "",
            TrackingId: data.TrackingId || "",
            destination: data.destination || "",
            deliveryDate: data.deliveryDate || "",
            pickUpTime: data.pickUpTime || "",
            departureTime: data.departureTime || "",
            courierName: data.courierName || "",
            totalFreight: data.totalFreight || "",
            product: data.product || "",
            mode: data.mode || "",
            origin: data.origin || "",
            quantity: data.quantity || "",
           created_At: data.created_At?.seconds
  ? new Date(data.created_At.seconds * 1000)
  : new Date(),
update_At: data.update_At?.seconds
  ? new Date(data.update_At.seconds * 1000)
  : new Date(),
          };

          setShippingOrder(mappedOrder);
          setError(null);
        } else {
          setError("Shipping order not found.");
          setShippingOrder(null);
        }
      } catch (err: unknown) {
        if (err instanceof FirebaseError) {
          setError(`Error: ${err.message}`);
        } else if (err instanceof Error) {
          setError(`An error occurred: ${err.message}`);
        } else {
          setError('An unexpected error occurred while fetching the shipping order.');
        }
        setShippingOrder(null);
        toast.error(error || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  return { shippingOrder, isLoading, error };
}
