"use client"
import { useEffect, useState } from 'react';

const PaymentVerification = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const verifyPayment = async () => {
            const tx_ref = new URLSearchParams(window.location.search).get('tx_ref');
            if (!tx_ref) {
                setStatus('Transaction reference not found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/verifyPayment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tx_ref }),
                });

                const data = await response.json();

                if (data.status === 'success') {
                    setStatus('Payment verified successfully!');
                } else {
                    setStatus('Payment verification failed.');
                }
            } catch (error) {
                setStatus('An error occurred during verification.');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, []);

    return (
        <div>
            {loading ? <p>Verifying payment...</p> : <p>{status}</p>}
        </div>
    );
};

export default PaymentVerification;
