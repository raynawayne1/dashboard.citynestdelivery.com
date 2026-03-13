import { useState, useEffect } from 'react';
import {
  collection,
  query,
  getDocs,
  orderBy,
  doc,
  getDoc,
  onSnapshot, 
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { FirestoreErrorHandler } from '../../Authcontext/FirestoreErrorHandler';
import { db } from '../../db/firebase';
import { useAuth } from '../../Authcontext/AuthContext'; 

export default function useGetAllUsersAtOnce() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);  // State to store users
  const [isLoading, setIsLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Handle error messages

  const fetchUsers = async () => {
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
      const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));  // No limit, fetch all users

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

      setUsers(fetchedUsers);  // Set the fetched users state

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
    fetchUsers();
  }, [user]);  // Dependency on user ensures it fetches only when the user is logged in

  return {
    users,
    isLoading,
    error,  // Expose the error message to parent component
  };
}
