import { ServerError } from "@/libs/error/server";
import { ZodError } from "zod";

const joinPaths = (paths: PropertyKey[]) => {
  if (paths.length === 0) return "__root__";
  let joined = "";
  for (const path of paths) {
    if (!joined) joined = path.toString();
    // symbol | number
    else if (typeof path !== "string") joined += `[${path.toString()}]`;
    else joined += `.${path}`;
  }
  return joined;
};

export const formatZodMessage = (error: ZodError) => {
  return error.issues.map((issue) => ({
    field: joinPaths(issue.path),
    code: issue.code,
    message: issue.message,
    ...(issue.code === "invalid_format" && { format: issue.format }),
  }));
};

/** for payload data error */
export const zodErrorToServerError = (error: ZodError<Record<string, unknown>> | ZodError<unknown[]>, data: any, on?: string) => {
  const missingFields = error.issues
    // filter missing only
    .filter((i) => {
      if (i.code === "invalid_type") {
        let value = data;
        for (const p of i.path) {
          value = value?.[p];
          if (value === undefined) return true;
        }
      }
      return false;
    })
    .map((i) => joinPaths(i.path));

  const debug = [{ on }, ...formatZodMessage(error)];
  if (!on) debug.shift();

  if (missingFields.length > 0) {
    return new ServerError("MISSING_FIELDS", { field: missingFields, debug });
  }

  const field = error.issues.reduce((acc, i) => {
    const fieldName = joinPaths(i.path);
    acc[fieldName] = i.message;
    return acc;
  }, {} as Record<string, string>);

  return new ServerError("CLIENT_FIELD", { field, debug });
};
