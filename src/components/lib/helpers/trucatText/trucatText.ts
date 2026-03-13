export default function trucatText(text: string | undefined, word: number): string | null {
  if (!text) return null;
  const words = text.split(" ");
  return words.slice(0, word).join(" ") + (words.length > word ? "..." : ""); // Append "..." if there are more than `word` words
}
