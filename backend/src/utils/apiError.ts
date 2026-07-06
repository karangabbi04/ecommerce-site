import { readonly } from "zod";

export class ApiError extends Error {
   public readonly statusCode: number;
  public readonly success = false;
  public readonly errors: unknown[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: any[] = []
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    

    Error.captureStackTrace(this, this.constructor);
  }
}