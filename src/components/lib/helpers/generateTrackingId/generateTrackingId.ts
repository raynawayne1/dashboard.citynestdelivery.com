export function generateTrackingId(length?: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let trackingId = "";
  const charactersLength = characters.length;
  const finalLength = length ?? 12; // Default to 12 if no length is provided

  for (let i = 0; i < finalLength; i++) {
    trackingId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return trackingId;
}
