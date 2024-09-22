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
