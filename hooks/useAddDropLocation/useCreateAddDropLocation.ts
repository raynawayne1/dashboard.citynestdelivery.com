import { useState } from "react";
import { updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../db/firebase";
import { toast } from "react-toastify";
import { AddDropFormData } from "../../app/admin/(others-pages)/shippings/view/add-drop-locaton/[id]/page";
import { useAuth } from "../../Authcontext/AuthContext";
import { generateShippingDropLocationEmail } from "@/utils/generateShippingDropLocationEmail";
import { sendEmailNotification } from "@/utils/emailService";

function useCreateAddDropLocation(shippingId: string, receiverName:string, receiverEmail:string) {
  const { user } = useAuth();
 
  const [isAddingDrop, setIsAddingDrop] = useState(false);

  // Check if current user is admin
  const checkIfAdmin = async (): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return false;
    }
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data()?.role === "admin") {
        return true;
      } else {
        toast.error("You don't have permission to perform this action.");
        return false;
      }
    } catch (err) {
      toast.error("Failed to verify user role.");
      return false;
    }
  };

  async function addDrop(data: AddDropFormData) {
    setIsAddingDrop(true);

    const isAdmin = await checkIfAdmin();
    if (!isAdmin) {
      setIsAddingDrop(false);
      return false;
    }

    try {
      const docRef = doc(db, "shippingOrders", shippingId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Shipping order not found");
        setIsAddingDrop(false);
        return false;
      }

      await updateDoc(docRef, {
        shippingDrops: arrayUnion(data),
      });



      // Generate the email content using the response data
      const html = generateShippingDropLocationEmail(
        receiverName,
        data.country,
        shippingId,
        data.status,
        data.address);

      const subject = "We will like to inform you that your shipment has updated";
      const text = `Dear ${receiverName}, We will like to inform you that your shipment has updated`;

      // Send the email notification
      try {
        const emailResult = await sendEmailNotification({
          to: receiverEmail,
          subject,
          text,
          html,
        });
      } catch (error) {
        console.error('Error sending email:', error);
      }



      toast.success("Successfully added shipping drop");
      setIsAddingDrop(false);
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to add drop");
      setIsAddingDrop(false);
      return false;
    }
  }

  return { isAddingDrop, addDrop };
}

export default useCreateAddDropLocation;
