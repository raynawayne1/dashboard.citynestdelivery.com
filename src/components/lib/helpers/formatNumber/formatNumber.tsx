// utils.ts
export function formatNumber(number: number | undefined, decimalPlaces: number = 0): string {
    // Check if the number is undefined or invalid (NaN)
    if (number === undefined || isNaN(number)) {
        return 'Invalid number'; // You can customize this message as needed
    }

    // Return formatted number as a string with the specified decimal places
    return number.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
}
