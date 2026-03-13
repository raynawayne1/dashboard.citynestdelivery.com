export function truncateBycharacter(text: string, maxLength: number = 30): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

 