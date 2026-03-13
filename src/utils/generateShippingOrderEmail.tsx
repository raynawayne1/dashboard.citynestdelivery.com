export function generateShippingOrderEmail(
    fullName: string,
    trackingId: string,
    shippingAddress: string,
    expectedDeliveryDate: string
): string {
    return `

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your Shipping Order Update</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background: #f0f4f8;
            color: #000;
            transition: color 0.3s ease;
        }

        .container {
            max-width: 520px;
            margin: 40px auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(1, 111, 185, 0.08);
            border-top: 6px solid #016FB9;
            padding: 28px 32px 36px;
            transition: box-shadow 0.3s ease;
        }

        .logo {
            display: flex;
            justify-content: center;
            margin-bottom: 26px;
        }

        .logo img {
            width: 160px;
            height: auto;
        }

        .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #013766;
            margin-bottom: 16px;
        }

        p {
            font-size: 14px;
            line-height: 1.65;
            margin: 0 0 16px 0;
            color: #000;
        }

        .order-info {
            background: #f9fbff;
            border-radius: 10px;
            padding: 28px 30px;
            max-width: 350px;
            margin: 0 auto 28px;
            box-shadow: 0 2px 6px rgba(1, 111, 185, 0.05);
            border: 1px solid #c6d6f9;
            transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .order-info .title {
            font-size: 18px;
            color: #016FB9;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
            letter-spacing: 0.04em;
        }

        .order-info p {
            font-weight: 500;
            font-size: 14px;
            line-height: 1.5;
            color: #224976;
            margin-bottom: 10px;
        }

        .delivery-title {
            text-align: center;
            font-size: 18px;
            color: #016FB9;
            font-weight: 700;
            margin-bottom: 14px;
            letter-spacing: 0.04em;
        }

        .delivery-date {
            background: #016fb9;
            color: #fff;
            border-radius: 10px;
            max-width: 350px;
            margin: 0 auto 32px;
            padding: 12px 18px;
            font-weight: 600;
            font-size: 14px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(1, 111, 185, 0.15);
            transition: background 0.3s ease;
        }

        .delivery-date:hover {
            background: #005899;
        }

        .footer-text {
            font-size: 14px;
            color: #ccc;
            text-align: center;
            margin-bottom: 28px;
            line-height: 1.45;
        }

        .signature {
            font-size: 15px;
            font-weight: 600;
            color: #224976;
            margin-bottom: 6px;
            text-align: left;
        }

        a {
            color: #016FB9;
            text-decoration: none;
            font-weight: 600;
        }

        a:hover {
            text-decoration: underline;
        }

        @media (max-width: 540px) {
            .container {
                margin: 20px 15px;
                padding: 25px 20px 30px;
                max-width: 100%;
            }

            .order-info,
            .delivery-date {
                max-width: 100%;
            }

            .logo img {
                width: 140px;
            }
        }

        @media (prefers-color-scheme: dark) {
            body {
                color: #fff;
                background: #f0f4f8;
            }

            .container {
                background: #fff;
                box-shadow: 0 2px 4px rgba(1, 111, 185, 0.04);
                border-top-color: #3399ff;
            }

            .order-info {
                background: #f9fbff;
                border-color: #3399ff88;
                box-shadow: 0 1px 3px rgba(51, 153, 255, 0.1);
            }

            .order-info .title,
            .greeting,
            .signature {
                color: #3399ff;
            }

            .order-info p {
                color: #003366;
            }

            .delivery-date {
                background: #3399ff;
                box-shadow: 0 2px 8px rgba(51, 153, 255, 0.25);
                color: #fff;
            }

            .delivery-date:hover {
                background: #1a75ff;
            }

            a {
                color: #3399ff;
            }
        }

    </style>
</head>

<body>
    <div class="container">
        <center>
           <div class="logo" style="display: flex; justify-content: center; align-items: center;">
            <img src="https://citynestdelivery.com/images/logo.png" alt="logo" border="0" />
            </div>
        </center>

        <p class="greeting">Hello <b>${fullName}</b>,</p>

        <p>

    We are pleased to inform you that your shipment has been successfully registered at our United Kingdom facility and is
    currently undergoing processing for delivery.
           
        </p>

        <div class="order-info">
            <span class="title">Tracking Information</span>
            <p style="padding-top: 10px;">Tracking Number:: <strong>${trackingId}</strong></p>
            <p>Status: <strong> Awaiting Departure!</strong></p>
            <p>Shipping Address: <strong>${shippingAddress}</strong></p>
        </div>

        <p class="delivery-title">Expected Delivery Date</p>
        <div class="delivery-date">${expectedDeliveryDate}</div>

        <p class="footer-text">
            If you have any questions or need assistance, please do not hesitate to contact us.
        </p>

        <p class="signature">Kind regards,</p>
        <p>Management.</p>
        <p class="signature"><a href="https://orbitdel.com/">citynestdelivery.com	</a></p>
    </div>
</body>

</html>




    `;
}
