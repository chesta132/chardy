import z from "zod";

export abstract class TurnstilePayload {
  static readonly validator = z.object({
    token: z.string(),
  });
}

export namespace TurnstilePayload {
  export type Validator = z.output<typeof TurnstilePayload.validator>;
}
