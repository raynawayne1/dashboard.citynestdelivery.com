export function generateShippingDropLocationEmail(
    fullNameHide: string,
    country: string,
    trackingIdHide: string,
    status: string,
    address: string
): string {
    return `

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Shipment In Progress</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background: #f0f4f8;
            color: #000;
            /* black text in light mode */
            transition: color 0.3s ease;
        }

        .container {
            max-width: 520px;
            margin: 40px auto;
            background: #fff;
            /* keep white background */
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
            /* black text in light mode */
        }

        .tracking-info {
            background: #f9fbff;
            border-radius: 10px;
            padding: 28px 30px;
            max-width: 350px;
            margin: 0 auto 28px;
            box-shadow: 0 2px 6px rgba(1, 111, 185, 0.05);
            border: 1px solid #c6d6f9;
            transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .tracking-info .title {
            font-size: 18px;
            color: #016FB9;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
            letter-spacing: 0.04em;
        }

        .tracking-info p {
            font-weight: 500;
            font-size: 14px;
            line-height: 1.5;
            color: #224976;
            margin-bottom: 10px;
        }

        .current-location-title {
            text-align: center;
            font-size: 18px;
            color: #016FB9;
            font-weight: 700;
            margin-bottom: 14px;
            letter-spacing: 0.04em;
        }

        .current-location {
            background: #016fb9;
            color: #fff;
            border-radius: 10px;
            max-width: 350px;
            margin: 0 auto 32px;
            padding: 12px 18px;
            font-weight: 600;
            font-size: 14px;
            text-align: center;
            word-break: break-word;
            box-shadow: 0 4px 15px rgba(1, 111, 185, 0.15);
            transition: background 0.3s ease;
        }

        .current-location:hover {
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

            .tracking-info,
            .current-location {
                max-width: 100%;
            }

            .logo img {
                width: 140px;
            }
        }

        /* Dark mode tweaks: no dark bg, but white text, and reduced shadows */
        @media (prefers-color-scheme: dark) {
            body {
                color: #fff;
                /* white text */
                background: #f0f4f8;
                /* keep light background */
            }

            .container {
                background: #fff;
                /* keep white container bg */
                box-shadow: 0 2px 4px rgba(1, 111, 185, 0.04);
                /* lighter shadow */
                border-top-color: #3399ff;
            }

            .tracking-info {
                background: #f9fbff;
                border-color: #3399ff88;
                box-shadow: 0 1px 3px rgba(51, 153, 255, 0.1);
            }

            .tracking-info .title,
            .greeting,
            .signature {
                color: #3399ff;
            }

            .tracking-info p {
                color: #003366;
            }

            .current-location {
                background: #3399ff;
                box-shadow: 0 2px 8px rgba(51, 153, 255, 0.25);
                color: #fff;
            }

            .current-location:hover {
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

        <p class="greeting">Hello <b>${fullNameHide}</b>,</p>

        <p>
            We are pleased to advise that your shipment has progressed to the next stage of transit and has now arrived in <b>${country}</b>,
            where it is undergoing standard processing procedures prior to onward delivery.
        </p>

        <div class="tracking-info">
            <span class="title">Tracking Information</span>
            <p style="padding-top: 10px;">Tracking Number: <strong>${trackingIdHide}</strong></p>
            <p>Status: <strong>${status}</strong></p>
            <p>Location: <strong>${address}</strong></p>
        </div>

        <p class="current-location-title">Current Location Of Your Items</p>

        <div class="current-location">${address}</div>

        <p class="footer-text">
            We hope this meets your approval. Please do not hesitate to get in touch via email if we can be of any
            further assistance.
        </p>

        <p class="signature">Yours sincerely,</p>
        <p class="signature"><a href="https://orbitdel.com/">citynestdelivery.com</a></p>
    </div>
</body>

</html>



  `;
}

