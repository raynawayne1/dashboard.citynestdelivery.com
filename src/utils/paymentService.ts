// utils/paymentService.ts

// Define the correct type for paymentData
interface PaymentData {
  userEmail: string;
  userFullName: string;
  amount: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  [key: string]: any; // optional, if the API returns more fields
}

export const sendEmailNotification = async (paymentData: PaymentData): Promise<ApiResponse> => {
  const { userEmail, userFullName, amount } = paymentData;

  const subject = 'Payment Successful';
  const text = `Hello ${userFullName}, your payment of NGN ${amount} was successful.`;
  const html = `<p>Hello ${userFullName},</p><p>Your payment of NGN ${amount} was successful.</p>`;

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userEmail,
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling email API:', error);
    throw new Error('Failed to send email');
  }
};
