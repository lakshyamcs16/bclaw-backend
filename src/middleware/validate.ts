import { Request, Response, NextFunction } from "express";
import { query, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

// Middleware to validate input
export const validateInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  // Check for validation errors (collect and handle errors in one place)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If errors exist, return a 400 Bad Request with the error details
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  // If no errors, proceed to the next middleware
  next();
};

// Array of validation rules for the 'query' parameter
export const validateQuery = [
  query("query") // Validate the 'query' parameter
    .isString() // Ensure it's a string
    .trim() // Remove whitespace from both ends
    .notEmpty() // Ensure it's not empty
    .withMessage("Query parameter is required") // Custom error message
    .isLength({ max: 1000 }) // Limit the length to 1000 characters
    .withMessage("Query must not exceed 1000 characters"), // Custom error message for length
];

// Array of validation rules for the 'page' parameter
export const validatePage = [
  query("page") // Validate the 'page' parameter
    .isInt({ min: 1 }) // Ensure it's a number
    .withMessage('Page number must be a positive integer greater than or equal to 1') // Error message for invalid page number
    .notEmpty() // Ensure it's not empty
    .withMessage("Page number parameter is required") // Custom error message
];

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Send a generic error response to avoid exposing sensitive information
  res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: err.message });
};


// Validate parameters to be string and not empty
export const validateQueryParam = (variable: string, message: string) => [
  query(variable).isString().trim().notEmpty().withMessage(message),
];
