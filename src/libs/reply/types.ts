import { CodeError } from "../error/codes";
import { SetCookie } from "cookie";

export type Pagination = {
  /** Indicates whether there is next data (for pagination) */
  hasNext?: boolean;
  /** Next offset for pagination */
  nextOffset?: number | null;
};

/**
 * Structure of an error response payload.
 */
export interface ErrorReplyType<T = Record<string, string>> {
  /** Unique error code */
  code: CodeError;
  /** Human-readable message */
  message: string;
  /** Optional UI title for displaying error */
  title?: string;
  /** Extra details for debugging */
  details?: string;
  /** Optional field reference (useful for forms) */
  field?: T extends Record<string, any> | Record<string, any>[] ? Partial<ExtractArray<T>> : Record<string, string>;
  /** HTTP status code override */
  status?: number;
}

/**
 * Standard response envelope.
 */
export interface ReplyEnvelope<T, Success extends boolean = boolean> {
  meta: {
    /** Optional debug values */
    debug?: any[];
    /** Status of response (SUCCESS/ERROR) */
    status: Success extends true ? "SUCCESS" : "ERROR";
  } & (Success extends true
    ? {
        /** Optional pagination meta */
        pagination?: Pagination;
        /** Optional information message */
        information?: string;
      }
    : {});
  /** Response payload data */
  data: T;
}

export type ResFunc = () => void;
export type ResType<SuccessReady extends boolean, ErrorReady extends boolean> = SuccessReady extends true
  ? ResFunc
  : ErrorReady extends true
    ? ResFunc
    : never;

export type PaginationOption = { limit: number; offset: number };
export type Cookie = Record<string, Omit<SetCookie, "name"> & { value: string }>;

export type StateErrorServer = Omit<ErrorReplyType, "field">;
