
    // Format Amount with commas and 2 decimal points in Naira (₦)
   export  const formatAmount = (amount: number | undefined) => {
        if (amount === undefined || isNaN(amount)) return "₦0.00"; // Default value if undefined or NaN

        // Format the amount using Intl.NumberFormat
        const formatter = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formatter.format(amount);  // This will properly format large amounts as well
    };