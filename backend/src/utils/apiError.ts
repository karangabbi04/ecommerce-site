export class ApiError extends Error {
  statusCode: number;
  errors: any[];
  success: boolean;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: any[] = []
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}