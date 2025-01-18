// src/utils/appError.ts

export class AppError extends Error {
  public statusCode: number;
  public success: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    // Set the prototype explicitly to support instanceof
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(msg: string): AppError {
    return new AppError(400, msg || "Bad Request");
  }

  static unauthorized(msg: string): AppError {
    return new AppError(401, msg || "Unauthorized");
  }

  static forbidden(msg: string): AppError {
    return new AppError(403, msg || "Forbidden");
  }

  static notFound(msg: string): AppError {
    return new AppError(404, msg || "Not Found");
  }

  static conflict(msg: string): AppError {
    return new AppError(409, msg || "Conflict");
  }

  static internalError(msg: string): AppError {
    return new AppError(500, msg || "Internal Server Error");
  }
}
