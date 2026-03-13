import { updateDoc, doc, getDocs, query, where, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { FirestoreErrorHandler } from "../../Authcontext/FirestoreErrorHandler";
import { useAuth } from "../../Authcontext/AuthContext";  // Import your auth context
import { db } from "../../db/firebase";

function useCreateAdmin() {
  const [isCreatingAdmin, setIsCreatingAdmin] = useState<boolean>(false);
  const { user, userRole } = useAuth();  // Get the logged-in user and their role

  console.log('Logged-in User:', user);  // Debugging line
  console.log('User Role:', userRole);  // Debugging line

  async function handleUseCreateAdmin(data: any, reset: any) {
    // Ensure only admins can make another user an admin
    if (!user || userRole !== "admin") {
      toast.error("You do not have permission to make another user an admin.");
      return;  // Ensure only admins can create other admins
    }

    try {
      setIsCreatingAdmin(true); // Set loading state before async operation

      // Check if the user exists by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", data?.email));  // Check by email
      const querySnapshot = await getDocs(q);

      // If user is not found, show error
      if (querySnapshot.empty) {
        toast.error("User with this email not found.");
        setIsCreatingAdmin(false); // Reset loading state
        return;
      }

      const userDocRef = doc(db, "users", querySnapshot.docs[0].id); // Get the user's document reference
      const userData = querySnapshot.docs[0].data();

      // Log user data to check if it exists and is in the expected format

      // Check if the logged-in user is trying to make themselves an admin
      if (user?.email === data?.email && userData.role === "admin") {
        toast.warning("You are already an admin.");
        setIsCreatingAdmin(false); // Reset loading state
        return;
      }

      // Check if the user being made admin already has the admin role
      if (userData.role === "admin") {
        toast.warning("This user is already an admin.");
        setIsCreatingAdmin(false); // Reset loading state
        return;
      }

      // Ensure valid date and AppointedAdmin values
      const appointedAdmin = user?.email || user?.uid;
      if (!appointedAdmin) {
        console.error('AppointedAdmin is invalid:', appointedAdmin);
        toast.error('Failed to set appointed admin. Please try again.');
        setIsCreatingAdmin(false);
        return;
      }

      // Update the user's role to 'admin' and ensure the `updatedAt` field is valid
      const updatedAt = Timestamp.now();  // Use Firestore Timestamp instead of ISO string

      await updateDoc(userDocRef, {
        role: "admin",  // Update the user's role to "admin"
        updatedAt: updatedAt,  // Ensure the updatedAt field is a Firestore Timestamp
        AppointedAdmin: appointedAdmin,  // Record the ID or email of the person making the update
      });

      toast.success("Successfully made the user an admin.");
      reset();  // Reset the form after success

    } catch (error) {
      if (error instanceof FirebaseError) {
        FirestoreErrorHandler(error);  // Handle Firebase errors
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsCreatingAdmin(false); // Reset loading state after the operation
    }
  }

  return {
    isCreatingAdmin,
    handleUseCreateAdmin,
  };
}

export default useCreateAdmin;
