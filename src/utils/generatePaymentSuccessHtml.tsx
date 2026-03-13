import formatFullDateTimeWithAMPM from '@/components/lib/helpers/formatFullDateTimeWithAMPM/formatFullDateTimeWithAMPM';



// Updated generateSuccessHtml function
export function generatePaymentSuccessHtml(amount: string, paymentMethod: string, transactionId: string, createdAt: string): string {
    // Convert the ISO 8601 string (created_at) to a Date object
    const date = new Date(createdAt);

    // Format the 'created_at' date using the formatFullDateTimeWithAMPM function
    const formattedDate = formatFullDateTimeWithAMPM(date);

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Successful</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              color: #333;
          }

          .container {
              width: 100%;
              max-width: 650px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
              padding: 30px;
          }

          .header {
              background: linear-gradient(90deg, #465fff, #6a7fff);
              color: #ffffff;
              padding: 20px;
              text-align: center;
              border-radius: 10px 10px 0 0;
          }

          .header img {
              width: 120px;
              margin-bottom: 10px;
          }

          .header h1 {
              margin: 0;
              font-size: 30px;
              font-weight: 700;
          }

          .content {
              padding: 20px;
              text-align: center;
          }

          .content h2 {
              color: #465fff;
              font-size: 24px;
              margin-bottom: 15px;
          }

          .details {
              background-color: #f9f9f9;
              padding: 25px;
              border-radius: 10px;
              margin-top: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
              text-align: center;
          }

          .details p {
              font-size: 18px;
              color: #555;
              margin: 8px 0;
          }

          .details strong {
              color: #465fff;
          }

          .button {
              display: inline-block;
              background-color: #465fff;
              color: #ffffff;
              padding: 12px 24px;
              font-size: 16px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 30px;
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
              transition: all 0.3s ease;
          }

          .button:hover {
              background-color: #6a7fff;
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }

          .footer {
              background-color: #f7f7f7;
              padding: 15px;
              text-align: center;
              font-size: 14px;
              color: #888;
              border-radius: 0 0 10px 10px;
              margin-top: 20px;
          }

          a {
              color: #465fff;
              text-decoration: none;
          }

          @media (max-width: 600px) {
              .container {
                  width: 100%;
                  padding: 15px;
              }
          }

      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <img src="https://your-logo-url.com/logo.svg" alt="Logo" />
              <h1>Payment Successful!</h1>
          </div>
          <div class="content">
              <h2>Thank You for Your Payment</h2>
              <p>Your payment was successfully processed. Below are the details of your transaction.</p>

              <div class="details">
                  <p><strong>Amount Paid:</strong> <span style="color: #465fff;">${amount} NGN</span></p>
                  <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                  <p><strong>Transaction ID:</strong> ${transactionId}</p>
                  <p><strong>Date:</strong> ${formattedDate}</p>
              </div>

              <a href="mailto:citynestdelivery.com" class="button">Contact Support</a>
          </div>

          <div class="footer">
              <p>&copy; 2025 SocialBizz. All Rights Reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
}
