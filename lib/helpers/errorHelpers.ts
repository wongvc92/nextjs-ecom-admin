import { ZodError } from "zod";

export const handleError = (error: unknown, context: string = "An error occurred") => {
  if (error instanceof ZodError) {
    // Specific handling for Zod validation errors
    return {
      error: `Validation error: ${error.errors.map((err) => err.message).join(", ")}`,
    };
  }

  return {
    error: `${context}. Please try again later.`,
  };
};
