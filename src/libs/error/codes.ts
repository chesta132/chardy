/**
 * Authentication-related error codes.
 */
export const codeErrorAuth = ["INVALID_AUTH"] as const;

/**
 * Field validation-related error codes.
 */
export const codeErrorField = ["MISSING_FIELDS", "CLIENT_FIELD"] as const;

/**
 * Client-side related error codes.
 */
export const codeErrorClient = ["TOO_MUCH_REQUEST", "FORBIDDEN"] as const;

/**
 * Server-side related error codes.
 */
export const codeErrorServer = ["SERVER_ERROR", "NOT_FOUND", "BAD_GATEWAY", "CONFLICT"] as const;

/**
 * All possible error code values.
 */
export const CodeErrorValues = [...codeErrorAuth, ...codeErrorField, ...codeErrorClient, ...codeErrorServer] as const;

export type CodeAuthError = (typeof codeErrorAuth)[number];
export type CodeFieldError = (typeof codeErrorField)[number];
export type CodeClientError = (typeof codeErrorClient)[number];
export type CodeServerError = (typeof codeErrorServer)[number];
export type CodeError = (typeof CodeErrorValues)[number];
