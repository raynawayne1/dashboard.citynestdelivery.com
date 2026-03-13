export function generateReferenceIdUniqueCharacters(length?: number): string {
  const timestamp: number = new Date().getTime();
  const randomNumber: number = Math.floor(Math.random() * 10000);
  let referenceId: string = `REF${timestamp}-${randomNumber}`;

  // If length is provided, trim or pad to match
  if (length && length > 0) {
    referenceId = referenceId.slice(0, length).padEnd(length, "0");
  }

  return referenceId;
}
