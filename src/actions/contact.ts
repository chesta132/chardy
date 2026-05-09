"use server";

import { ContactService } from "@/services/contact";

export async function sendMessageAction(...args: Parameters<typeof ContactService.sendMessage>) {
  return ContactService.sendMessage(...args);
}
