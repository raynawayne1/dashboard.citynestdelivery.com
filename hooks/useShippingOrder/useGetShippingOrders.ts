import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from '../../db/firebase';
import { useAuth } from '../../Authcontext/AuthContext';
import { toast } from 'react-toastify';
import { IShippingPayload } from '@/components/Interface';

export default function useGetShippingOrdersForAdmin(limitCount: number = 5) {
  const { user } = useAuth();  
  const [shippingOrders, setShippingOrders] = useState<IShippingPayload[]>([]);
  const [isLoadingShippingOrders, setIsLoadingShippingOrders] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const isFetchedOnce = useRef(false);

  // Check if user is admin
  const checkIfAdmin = async () => {
    if (!user) {
      setError("You must be logged in to access this data.");
      setIsLoadingShippingOrders(false);
      return false;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data()?.role === 'admin') {
        return true;
      } else {
        setError("You don't have permission to view this data.");
        setIsLoadingShippingOrders(false);
        return false;
      }
    } catch {
      setError("An error occurred while checking user role.");
      setIsLoadingShippingOrders(false);
      return false;
    }
  };

  // Fetch shipping orders realtime with pagination
  const fetchOrdersRealTime = useCallback(() => {
    setIsLoadingShippingOrders(true);

    try {
      const shippingOrdersRef = collection(db, 'shippingOrders');
      const ordersQuery = query(shippingOrdersRef);

      const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
        const ordersList: IShippingPayload[] = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
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
            shippingDrops:data.shippingDrops || "",
            imageParcelImages: data.imageParcelImages || [],
            deliveryDate: data.deliveryDate || "",
            pickUpTime: data.pickUpTime || "",
            departureTime: data.departureTime || "",
            courierName: data.courierName || "",
            totalFreight: data.totalFreight || "",
            product: data.product || "",
            mode: data.mode || "",
            origin: data.origin || "",
            quantity: data.quantity || "",
            created_At: data.created_At ? new Date(data.created_At.seconds * 1000) : new Date(),
            updated_At: data.update_At ? new Date(data.update_At.seconds * 1000) : new Date(),
          };
        });

        // Sort descending by created_At
        const sortedOrders = ordersList.sort((a, b) => {
          const aTime = a.created_At ? new Date(a.created_At).getTime() : 0;
          const bTime = b.created_At ? new Date(b.created_At).getTime() : 0;
          return bTime - aTime;
        });

        // Pagination calculation
        const total = sortedOrders.length;
        setTotalOrders(total);
        const pages = Math.ceil(total / limitCount);
        setTotalPages(pages);

        const startIndex = (currentPage - 1) * limitCount;
        const paginatedOrders = sortedOrders.slice(startIndex, startIndex + limitCount);

        setShippingOrders(paginatedOrders);
        setIsLoadingShippingOrders(false);
      });

      return unsubscribe;
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(`Error: ${err.message}`);
      } else if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unexpected error occurred while fetching the shipping orders.');
      }
      toast.error(error || "An unexpected error occurred.");
      setIsLoadingShippingOrders(false);
    }
  }, [limitCount, currentPage, error]);

  // Effect: check admin & fetch shipping orders
  useEffect(() => {
    const fetchOrders = async () => {
      const isAdmin = await checkIfAdmin();
      if (isAdmin) {
        const unsubscribe = fetchOrdersRealTime();
        return () => unsubscribe && unsubscribe();
      }
    };

    fetchOrders();

    return () => {
      isFetchedOnce.current = false;
    };
  }, [currentPage, user, fetchOrdersRealTime]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setIsLoadingShippingOrders(true);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setIsLoadingShippingOrders(true);
    }
  };

  return {
    shippingOrders,
    isLoadingShippingOrders,
    error,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  };
}
