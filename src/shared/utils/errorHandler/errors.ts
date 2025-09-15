export class AppError extends Error {
  public isOperational: boolean;

  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation Error") {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication Error") {
    super(message, 401);
  }
}

export class PermissionError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}
