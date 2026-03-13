"use client";

import { updateDoc, doc, getDocs, query, where, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { FirestoreErrorHandler } from "../../Authcontext/FirestoreErrorHandler";
import { useAuth } from "../../Authcontext/AuthContext";  // Import your auth context
import { db } from "../../db/firebase";

function useRemoveRole() {
  const [isRemovingRole, setIsRemovingRole] = useState<boolean>(false);
  const { user, userRole } = useAuth();  // Get the logged-in user and their role

  async function handleUseRemoveRole(data: any, reset: any) {
    // Ensure the user is logged in before proceeding
    if (!user) {
      toast.error("You must be logged in to modify roles.");
      return;
    }

    // Ensure the user has the necessary role (e.g., admin or other privilege)
    if (userRole !== "admin") {
      toast.error("You do not have permission to modify other users' roles.");
      return;
    }

    try {
      setIsRemovingRole(true); // Set loading state before async operation
      
      // Check if the user exists by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", data?.email));  // Check by email
      const querySnapshot = await getDocs(q);

      // If user is not found, show error
      if (querySnapshot.empty) {
        toast.error("User with this email not found.");
        setIsRemovingRole(false); // Reset loading state
        return;
      }

      const userDocRef = doc(db, "users", querySnapshot.docs[0].id); // Get the user's document reference
      const userData = querySnapshot.docs[0].data();

      // If the user has the same email as the logged-in user, show a warning
      if (user?.email === data?.email) {
        toast.warning("You cannot modify your own role.");
        setIsRemovingRole(false); // Reset loading state
        return;
      }

      // Check if the user is currently an admin or any other role besides 'user'
      if (userData.role === "user") {
        toast.warning("This user is already a regular user.");
        setIsRemovingRole(false); // Reset loading state
        return;
      }

      // Update the user's role to 'user' (removing admin or any other higher role)
      await updateDoc(userDocRef, {
        role: "user",  // Update the user's role to 'user'
        updatedAt:  new Date().toISOString(),  // Set the updatedAt field to current server timestamp
        AppointedBy: user?.email || user?.uid,  // Record the ID or email of the person making the update
      });

      toast.success("Successfully removed the user's admin role.");
      reset();  // Reset the form after success

    } catch (error) {
      if (error instanceof FirebaseError) {
        FirestoreErrorHandler(error);  // Handle Firebase errors
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsRemovingRole(false); // Reset loading state after the operation
    }
  }

  return {
    isRemovingRole,
    handleUseRemoveRole,
  };
}

export default useRemoveRole;
