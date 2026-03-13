import { sendEmailNotification } from '@/utils/emailService';
import { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../db/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../../Authcontext/AuthContext";
import { generateSendEmailTemplate } from "@/utils/generateSendEmailTemplate";

export interface SendEmailFormData {
  subject: string;
  email: string;
  message: string;
  name: string;
  purpose: string;
}

function useSendEmail() {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);

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

  async function handleSendEmail(data: SendEmailFormData) {
    setIsSending(true);

    const isAdmin = await checkIfAdmin();
    if (!isAdmin) {
      setIsSending(false);
      return false;
    }

    try {
      const { email: to, subject, message, name, purpose } = data;

      // Use your HTML email template generator here
      const html = generateSendEmailTemplate(name, purpose, subject, message);

      await sendEmailNotification({
        to,
        subject,
        text: message,
        html,
      });

      toast.success("Email sent successfully.");
      setIsSending(false);
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to send email.");
      setIsSending(false);
      return false;
    }
  }

  return { isSending, handleSendEmail };
}

export default useSendEmail;
