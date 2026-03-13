import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../db/firebase';

export const sendEmailNotification = async ({
  to,
  subject,
  html,
  text  
}: {
  to: string;
  subject: string;
  html: string;
  text?: string; 
}) => {
  try {
    // ✅ Check Firestore for unsubscribed users
    const unsubscribeRef = doc(db, 'unsubscribed_emails', to);
    const unsubSnap = await getDoc(unsubscribeRef);

    if (unsubSnap.exists()) {
      console.log('User has unsubscribed, skipping email:', to);
      return { message: 'User unsubscribed, email not sent' };
    }

    // Send email via API
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html, text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to send email');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    const err = error as Error;
    throw new Error('Failed to send email notification: ' + err.message);
  }
};
