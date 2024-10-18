import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "./db/schema/products";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertCentsToTwoDecimalString = (priceInCents: number): string => {
  if (!priceInCents) return "0";
  return (priceInCents / 100).toFixed(2);
};

export const currencyFormatter = (priceInCents: number): string => {
  if (!priceInCents) return "0";
  return `RM ${convertCentsToTwoDecimalString(priceInCents)}`;
};

export const convertTwoDecimalNumberToCents = (priceInTwoDecimal: number): number => {
  return priceInTwoDecimal * 100;
};

export const convertCentsToTwoDecimalNumber = (priceInCents: number): number => {
  return priceInCents / 100;
};

export const convertGramToKilogram = (gram: number): number => {
  return gram / 1000;
};

export const convertKilogramToGram = (kilogram: number): number => {
  return kilogram * 1000;
};

/**
 * Convert an image URL to a File object.
 *
 * @param {string} imageUrl - The URL of the image to be converted.
 * @param {string} filename - The name to give the converted file.
 * @param {string} mimeType - The MIME type of the image (e.g., 'image/jpeg', 'image/png').
 * @returns {Promise<File>} - A promise that resolves to a File object.
 */
export const urlToFile = async (imageUrl: string, filename: string, mimeType: string): Promise<File> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
};

type PlainObject = { [key: string]: any };
type FormDataValue = string | number | boolean | Blob | FormData | PlainObject | PlainObject[] | null | undefined;

// Type guard to check if a value is a plain object
function isPlainObject(value: any): value is PlainObject {
  return value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof FormData) && !(value instanceof Blob);
}

// Type guard to check if a value is an array
function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

// Function to append data to FormData
export function appendFormData(formData: FormData, key: string, data: FormDataValue): void {
  if (data === null || data === undefined) {
    formData.append(key, "");
  } else if (isPlainObject(data)) {
    // Handle nested objects
    Object.keys(data).forEach((subKey) => {
      appendFormData(formData, `${key}[${subKey}]`, (data as PlainObject)[subKey]);
    });
  } else if (isArray(data)) {
    // Handle arrays
    data.forEach((value, index) => {
      appendFormData(formData, `${key}[${index}]`, value);
    });
  } else {
    // Handle primitive types and Blob
    formData.append(key, data as string | Blob);
  }
}

export const capitalizeSentenceFirstChar = (sentence: string) => {
  if (!sentence) return "";
  const firstChar = sentence.charAt(0).toUpperCase();
  const restChars = sentence.slice(1).toLowerCase();
  return firstChar + restChars;
};

export const calculateTotalDimensions = (products: Product[]) => {
  return products.reduce(
    (totals, product) => {
      return {
        totalWidth: totals.totalWidth + product.width,
        totalLength: totals.totalLength + product.length,
        totalHeight: totals.totalHeight + product.height,
      };
    },
    {
      totalWidth: 0,
      totalLength: 0,
      totalHeight: 0,
    }
  );
};
