import z from "zod";
import { EndpointPaths, generatePath } from ".";
import { ContactPayload } from "@/payloads/contact";

export abstract class ContactEndpoints {
  static readonly PATHS = {
    POST: {
      "/contact": generatePath(z.null(), ContactPayload.sendMessage),
    },
  } satisfies EndpointPaths;
}
