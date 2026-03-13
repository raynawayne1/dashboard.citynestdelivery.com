import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from '../../db/firebase';
import { useAuth } from '../../Authcontext/AuthContext';
import { toast } from 'react-toastify';
import { ICreateOrder } from '@/components/Interface';

export default function useGetOrders(limitCount: number = 2) {
    const { user } = useAuth();  // Get the logged-in user
    const [orders, setOrders] = useState<ICreateOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false); // Start as false
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const isFetchedOnce = useRef<boolean>(false);

    // This ref helps track pagination actions to avoid resetting the loading state prematurely
    const isPaginating = useRef<boolean>(false);

    // Fetch orders for the logged-in user
    const fetchOrdersForUser = useCallback(async (page: number) => {
        setIsLoadingOrders(true); // Set loading state to true before fetching data

        if (!user) {
            setError("You must be logged in to access your orders.");
            setIsLoadingOrders(false); // Set loading to false if no user
            return;
        }

        try {
            // Fetch user document from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData && userData.orders) {
                    // Sort orders by created time (newest first)
                    const sortedOrders = userData.orders.sort((a: any, b: any) => {
                        const aTime = a.createdAt?.seconds ?? 0; // Provide a fallback if `seconds` is null or undefined
                        const bTime = b.createdAt?.seconds ?? 0; // Same fallback for `b`
                        return bTime - aTime; // Sort in descending order (newest first)
                    });

                    if (!isFetchedOnce.current) {
                        setTotalOrders(sortedOrders.length);
                        const calculatedTotalPages = Math.ceil(sortedOrders.length / limitCount);
                        setTotalPages(calculatedTotalPages);
                        isFetchedOnce.current = true;
                    }

                    const startIndex = (page - 1) * limitCount;
                    const paginatedOrders = sortedOrders.slice(startIndex, startIndex + limitCount);
                    setOrders(paginatedOrders);  // Set the orders for the current page
                    setIsLoadingOrders(false);  // Stop loading after orders are fetched
                } else {
                    setError("No Order Found!");
                    setIsLoadingOrders(false); // Stop loading if no orders
                }
            } else {
                setError("User not found.");
                setIsLoadingOrders(false); // Stop loading if user not found
            }
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                setError(` ${err.message}`);
            } else if (err instanceof Error) {
                setError(`An error occurred: ${err.message}`);
            } else {
                setError('An unexpected error occurred while fetching your orders.');
            }
            toast.error(error || "An unexpected error occurred.");
            setIsLoadingOrders(false); // Stop loading if error occurs
        }
    }, [user, limitCount, error]);

    // Fetch orders when the page changes
    useEffect(() => {
        if (user) {
            fetchOrdersForUser(currentPage);  // Fetch the user's orders
        }
    }, [currentPage, user]);  // Re-run when user or page changes

    // Real-time listener to listen for order changes from Firebase
    useEffect(() => {
        if (!user) return;  // If no user, stop

        const unsubscribe = onSnapshot(
            doc(db, 'users', user.uid), // Listen to changes on the user's document
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    if (userData && userData.orders) {
                        // Sort orders by created time (newest first)
                        const sortedOrders = userData.orders.sort((a: any, b: any) => {
                            const aTime = a.createdAt?.seconds ?? 0;
                            const bTime = b.createdAt?.seconds ?? 0;
                            return bTime - aTime;
                        });

                        // Calculate pagination based on the sorted orders
                        const startIndex = (currentPage - 1) * limitCount;
                        const paginatedOrders = sortedOrders.slice(startIndex, startIndex + limitCount);

                        setOrders(paginatedOrders);  // Update orders when Firestore data changes

                        // Update total pages if orders count changes
                        setTotalOrders(sortedOrders.length);
                        setTotalPages(Math.ceil(sortedOrders.length / limitCount));
                    }
                }
            },
            (err) => {
                setError('An error occurred while fetching your orders.');
                setIsLoadingOrders(false);
            }
        );

        // Cleanup listener on unmount or when the user changes
        return () => unsubscribe();
    }, [user, currentPage, limitCount]);  // Only depend on these values to optimize rerenders

    // Handle Next Page click
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            isPaginating.current = true; // Mark that we are paginating
            setIsLoadingOrders(true); // Set loading state to true
            setCurrentPage((prevPage) => prevPage + 1); // Increment page
        }
    };

    // Handle Previous Page click
    const handlePrevPage = () => {
        if (currentPage > 1) {
            isPaginating.current = true; // Mark that we are paginating
            setIsLoadingOrders(true); // Set loading state to true
            setCurrentPage((prevPage) => prevPage - 1); // Decrement page
        }
    };

    return {
        orders,
        isLoadingOrders,
        error,
        currentPage,
        totalPages,
        handleNextPage,
        handlePrevPage,
    };
}
