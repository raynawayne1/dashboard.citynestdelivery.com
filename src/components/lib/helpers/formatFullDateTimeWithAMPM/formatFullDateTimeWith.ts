
export default function formatFullDateTimeWith(date: Date): string {
  // Check if the date is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date object');
  }

  // Array to map day number (0-6) to abbreviated day name
  const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Array to map month number (0-11) to abbreviated month name
  const monthsOfYear: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Extract individual date components
  const dayOfWeek: string = daysOfWeek[date.getDay()]; // Abbreviated day name (e.g., "Tue")
  const month: string = monthsOfYear[date.getMonth()]; // Abbreviated month name (e.g., "Apr")
  const day: string = String(date.getDate()).padStart(2, '0'); // Day of the month (e.g., "01")
  const year: number = date.getFullYear(); // Year (e.g., "2025")

  let hours: number = date.getHours(); // Hour (24-hour format)
  const minutes: string = String(date.getMinutes()).padStart(2, '0'); // Minutes
  const seconds: string = String(date.getSeconds()).padStart(2, '0'); // Seconds

  // AM/PM formatting
  const ampm: string = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12; // Convert to 12-hour format
  hours = hours ? hours : 12; // Handle midnight (0 hours) as 12

  // Format the date as "Tue Apr 01 2025 - 03:29:23 PM"
  return `${dayOfWeek} ${month} ${day} ${year} `;
}
