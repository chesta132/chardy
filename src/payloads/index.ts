import { routing } from "@/i18n/routing";
import z from "zod";

export abstract class Payload {
  static readonly LOCALIZATION = {
    INVALID_EMAIL: "INVALID_EMAIL",
    REQUIRED_FIELD: "REQUIRED_FIELD",
    INVALID_ENUM: "INVALID_ENUM",
  } as const;

  static readonly locale = z.enum(routing.locales, this.LOCALIZATION.INVALID_ENUM);
}
