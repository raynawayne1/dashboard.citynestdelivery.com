"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { AuthErrorHandler } from "../Authcontext/AuthErrorHandler";
import IpInfo from "@/components/auth/Utils/IpInfo/IpInfo";
import { auth, db } from "../db/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isLoginUser, setIsLoginUser] = useState(false);
  const [isCreatingUserUsingGoogle, setIsCreatingUserUsingGoogle] = useState(false);
  const router = useRouter();

  // Check user authentication state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      setLoading(false);

      if (!authUser) {
        router.push("/");
        return;
      }

       const userDocRef = doc(db, "users", authUser.uid);
      const docSnap = await getDoc(userDocRef);

    


      // Retrieve user data from Firestore
      if (!docSnap.exists()) {
        try {
          // Handle pending orders if any
          const pendingOrders = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
          if (pendingOrders.length > 0) {
            await updateDoc(userDocRef, { orders: pendingOrders });
            localStorage.removeItem("pendingOrders");
            toast.success("Orders have been successfully saved");
          }
        } catch (error) {
      
        }
      } else {
        const userData = docSnap.data();
        setUserRole(userData.role);
      }

      // If the user is authenticated and the path is '/', redirect to '/admin'
      if (authUser && location.pathname === "/" && authUser.emailVerified) {
        router.push("/admin");
      }
    });

    return () => unsubscribe();
  }, [loading, router]);

  // SignIn with Google
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  
const redirectUrl = process.env.NODE_ENV === 'production'
  ? 'https://admin.orbitdel.com/__/auth/handler'  // Use the subdomain for production
  : 'http://localhost:3000/__/auth/handler';  // Local development domain

  try {
    setIsCreatingUserUsingGoogle(true);

    // Step 1: Sign in with Google
    const signInWithGoogleResult = await signInWithPopup(auth, provider);
    const user = signInWithGoogleResult.user;
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    // Step 2: Check if email is verified
    if (!user.emailVerified) {
      toast.error("Please verify your email before logging in.");
      setIsCreatingUserUsingGoogle(false);
      return;
    }

    // Step 3: Generate a username based on email (before '@')
    let username = user.email.split('@')[0];  // Use the part before '@'
    
    // Step 4: Check if the username already exists in the 'usernames' collection
    let querySnapshot = await getDocs(query(collection(db, "usernames"), where("username", "==", username)));

    let originalUsername = username;
    let counter = 1;

    // Step 5: If the username exists, generate a unique username by appending numbers
    while (!querySnapshot.empty) {
      username = `${originalUsername}_${counter}`;
      querySnapshot = await getDocs(query(collection(db, "usernames"), where("username", "==", username)));  // Check again if the new username exists
      counter++;
    }

    // Step 6: If the user document doesn't exist, create it
    if (!docSnap.exists()) {
      const ipInfo = await IpInfo();
      
      // Create a new user document in the "users" collection
      await setDoc(userDocRef, {
        ...ipInfo,
        email: user.email,
        providerId: signInWithGoogleResult.providerId,
        fullName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        isAnonymous: user.isAnonymous,
        emailVerified: user.emailVerified,
        uid: user.uid,
        role: "user", // Default role
        username: username,  // Store the unique username
        createdAt: Timestamp.fromMillis(Date.now()),
        updatedAt: Timestamp.fromMillis(Date.now())
      });

      // Step 7: Store the username in the 'usernames' collection to ensure it's unique
      await setDoc(doc(db, "usernames", username), { username: username });
    }

    // Step 8: Redirect the user to the admin page or home page
    router.push("/admin");

  } catch (error) {
    if (error instanceof FirebaseError) {
      AuthErrorHandler(error);
      setIsCreatingUserUsingGoogle(false);
    } else {
      toast.error(error.message);
      setIsCreatingUserUsingGoogle(false);
    }
  }
};







// Register new user with email and password and send email verification
const authRegister = async (user) => {
  try {
    setIsCreatingUser(true);

    // Step 1: Check if the username already exists by querying the 'usernames' collection
    const querySnapshot = await getDocs(query(collection(db, "usernames"), where("username", "==", user.username)));

    // Step 2: If username exists, show an error and stop registration
    if (!querySnapshot.empty) {
      setIsCreatingUser(false);
      toast.error("Username already taken, please choose another one.");
      return;
    }

    // Step 3: If username is unique, proceed with registration
    const ipInfo = await IpInfo();
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);

    // Step 4: Send email verification after registration
    await sendEmailVerification(userCredential.user);

    // Step 5: Add user info to Firestore using UID as document ID
    delete user.password; // Don't store password

    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...ipInfo,
      ...user,
      role: "user",
      orders: [],
      emailVerified: false,
      createdAt: Timestamp.fromMillis(Date.now()),
      updatedAt: Timestamp.fromMillis(Date.now()),
    });

    // Step 6: Store the username in the 'usernames' collection to ensure it's unique
    await setDoc(doc(db, "usernames", user.username), { username: user.username });

    setIsCreatingUser(false);
    toast.success("Account successfully created. A verification link has been sent to your email.");
    router.push("/check-your-email"); // Redirect to a page asking the user to check their email
  } catch (error) {
    console.log("Error details:", error);  // Log the full error object
    if (error instanceof FirebaseError) {
      console.log("FirebaseError Code:", error.code); // Log error code
      console.log("FirebaseError Message:", error.message); // Log error message
      AuthErrorHandler(error); // Use your custom handler if defined
    } else {
      toast.error(error.message); // Show the error message
    }
    setIsCreatingUser(false);
  }
};



  // Login with email and password and check email verification
const authLogin = async (user) => {
  setIsLoginUser(true);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);

    // Check if the email is verified
    if (!userCredential.user.emailVerified) {
      toast.error("Your email is not verified. Sending a verification email...");

      // Resend the verification email
      await sendEmailVerification(userCredential.user);
      // Log out the user and redirect to the check email page
      signOut(auth);
      toast.info("A verification email has been sent. Please check your inbox.");
      setIsLoginUser(false);
      router.push("/check-your-email"); // Redirect to the "Check your email" page
      return;
    }

    // Fetch the user's document from Firestore
    const userDocRef = doc(db, "users", userCredential.user.uid);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const userDocData = docSnap.data(); // Get document data

      // Check if the user is an admin
      if (userDocData.role !== "admin" || !userDocData.AppointedAdmin) {
           signOut(auth);
              setIsLoginUser(false);
              toast.error("Access Denied: You are not authorized to log in as an administrator.", {
                className: 'bg-red-500 text-white font-medium text-sm p-3 rounded-md shadow-lg'
              });
        router.push("/"); // Redirect to home or login page
         
        return;
      }

      // If the user's email is verified, update Firestore (optional, for sync)
      if (!userDocData.emailVerified && userCredential.user.emailVerified) {
        await updateDoc(userDocRef, {
          emailVerified: true,
          updatedAt: Timestamp.fromMillis(Date.now()), // Mark the update time
        });
        toast.success("Email verification status updated in Firestore.");
      }

      // Proceed to the admin page
      router.push("/admin");
    } else {
      toast.error("User not found in Firestore.");
      router.push("/"); // Redirect to home or login page
    }

    setIsLoginUser(false);

  } catch (error) {
    if (error instanceof FirebaseError) {
      AuthErrorHandler(error);
      console.log(error);
      setIsLoginUser(false);
    } else {
      toast.error(error.message);
      setIsLoginUser(false);
    }
  }
};


  // Log out function
  const logOut = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        signInWithGoogle,
        logOut,
        loading,
        authRegister,
        authLogin,
        isLoginUser,
        isCreatingUser,
        isCreatingUserUsingGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
