// formatters.ts
export const formatters = {
  format: (price: number): string => {
    if (typeof price !== "number" || isNaN(price)) {
      throw new Error("Invalid price number");
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  },
};

export function capitalizeFirstChar(letter: string) {
  if (!letter) return "";
  return letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase();
}

export function capitalizeSentenceFirstChar(sentence: string) {
  if (!sentence) return "";
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
