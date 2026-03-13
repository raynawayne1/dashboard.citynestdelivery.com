import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

export const FirestoreErrorHandler = (error: FirebaseError) => {
    switch (error?.code) {
        case "permission-denied":
            toast.error("Permission denied. You don't have access to this resource.");
            break;
        case "unavailable":
            toast.error("Firestore is unavailable. Please try again later.");
            break;
        case "not-found":
            toast.error("Document not found. Please check the ID and try again.");
            break;
        case "cancelled":
            toast.error("Request cancelled. Please try again.");
            break;
        // Add more Firestore-specific error cases as needed
        default:
            toast.error("Oops! Something went wrong. Please try again later.");
    }
};