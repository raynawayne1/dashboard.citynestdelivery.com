import { useState, useEffect } from 'react';
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  doc,
  getDoc,
  QueryDocumentSnapshot,
  onSnapshot, // Import onSnapshot for real-time updates
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler'; // Ensure this is properly imported
import { db } from '../../db/firebase';
import { useAuth } from '../../Authcontext/AuthContext'; // Custom auth hook to get user info

export default function useGetAllUsers(usersPerPage = 10) {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);  // State to store users
  const [isLoading, setIsLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Handle error messages
  const [currentPage, setCurrentPage] = useState<number>(1);  // Current page number
  const [totalPages, setTotalPages] = useState<number>(1);  // Total number of pages
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null); // Last fetched document
  const [pageStack, setPageStack] = useState<QueryDocumentSnapshot[]>([]);  // Stack to track page history

  const fetchUsers = async (direction: 'initial' | 'next' | 'prev' = 'initial') => {
    setIsLoading(true);
    setError(null);  // Reset error message before each fetch attempt

    try {
      if (!user) {
        setError("You must be logged in to access this data.");
        setIsLoading(false);
        return;
      }

      // Check if the logged-in user is an admin
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
        setError("You don't have permission to view this data.");
        setIsLoading(false);
        return;
      }

      const usersRef = collection(db, 'users');
      let usersQuery;

      // Define query based on pagination direction
      if (direction === 'next' && lastVisible) {
        // For 'next', start after the last visible document
        usersQuery = query(usersRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(usersPerPage));
      } else if (direction === 'prev' && pageStack.length > 1) {
        // For 'prev', start after the previous cursor and update pageStack
        const prevCursor = pageStack[pageStack.length - 2];
        usersQuery = query(usersRef, orderBy('createdAt', 'desc'), startAfter(prevCursor), limit(usersPerPage));
        setPageStack(prev => prev.slice(0, -1));  // Remove the last page from stack
        setCurrentPage(prev => Math.max(prev - 1, 1));  // Decrement current page number
      } else {
        // Initial load or reset
        usersQuery = query(usersRef, orderBy('createdAt', 'desc'), limit(usersPerPage));
        setPageStack([]);  // Clear the page stack
        setCurrentPage(1);  // Reset to first page
      }

      // Fetch the documents based on the query
      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        setError("No users found.");
        setIsLoading(false);
        return;
      }

      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(fetchedUsers);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

      // For next page, update the page stack and current page number
      if (direction === 'next') {
        setPageStack(prev => [...prev, snapshot.docs[0]]);
        setCurrentPage(prev => prev + 1);
      }

      // Get the total count of users for pagination
      const countSnap = await getCountFromServer(usersRef);
      const totalUsers = countSnap.data().count;
      setTotalPages(Math.ceil(totalUsers / usersPerPage));

      setIsLoading(false);
    } catch (error) {
      if (error instanceof FirebaseError) {
        FirestoreErrorHandler(error);  // Custom Firebase error handler
        setError("Network error occurred. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  // Real-time update with onSnapshot (only for admin)
  useEffect(() => {
    if (!user) return; // If user is not logged in, don't set up the real-time listener

    const checkAdminAndFetch = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data()?.role === 'admin') {
        const usersRef = collection(db, 'users');
        const unsubscribe = onSnapshot(query(usersRef, orderBy('createdAt', 'desc')), (snapshot) => {
          // Handle real-time data updates
          const updatedUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setUsers(updatedUsers); // Update the state with the new users
        }, (error) => {
          if (error instanceof FirebaseError) {
            FirestoreErrorHandler(error);
          }
          setError("Error fetching real-time data");
        });

        // Clean up the listener when the component unmounts
        return unsubscribe;
      } else {
        setError("You don't have permission to view this data.");
      }
    };

    checkAdminAndFetch();
  }, [user]);  // Dependency on user ensures it listens for changes only when the user is logged in

  // Initial fetch on component mount or when user changes
  useEffect(() => {
    fetchUsers('initial');
  }, [user]);  // Dependency on user ensures it fetches only when the user is logged in

  return {
    users,
    isLoading,
    error,  // Expose the error message to parent component
    currentPage,
    totalPages,
    fetchNextPage: () => fetchUsers('next'),  // Function to fetch next page
    fetchPreviousPage: () => fetchUsers('prev'),  // Function to fetch previous page
  };
}
