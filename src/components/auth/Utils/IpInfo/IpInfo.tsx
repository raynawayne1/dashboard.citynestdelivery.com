export default async function IpInfo() {
  try {
    // Use HTTPS for production
    const ipInfo = await fetch("https://ip-api.com/json/?fields=61439");

    // Check if the response was successful
    if (!ipInfo.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse the response body as JSON
    const ipInfoResponse = await ipInfo.json();

    return ipInfoResponse;
  } catch (error) {
    // Return a default error object if something goes wrong
    console.error("Error fetching IP info:", error);
    return { error: "Failed to fetch IP info" };
  }
}
