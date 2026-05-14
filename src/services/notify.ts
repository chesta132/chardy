import { isDevEnv, OWNER_EMAIL } from "@/config";
import { sendMail } from "../libs/email";
import { timeInSec } from "../libs/manipulate/number";
import { redis } from "../libs/redis";
import { EmailTemplates } from "../libs/email/templates";
import { ActionFunc } from "nectic/actions";

type NotifyErrorProps = {
  type: string;
  message: string;
  digest?: string;
  url?: string;
};

export const notifyError: ActionFunc<[NotifyErrorProps], [], void> = async ({ outcome }, { message, type, digest, url }) => {
  const out = () => outcome.success(undefined).ok();
  if (isDevEnv()) return out();
  try {
    const cacheKey = digest ?? `msg:${simpleHash(message)}`;

    const alreadyNotified = await redis.get(redisKey(cacheKey));
    if (alreadyNotified) return out();

    const html = EmailTemplates.errorNotification({
      errorMessage: message,
      errorDigest: digest,
      errorType: type,
      url,
      occurredAt: new Date(),
    });

    console.error(`[notifyErrorAction] ${type}${digest ? ` · ${digest}` : ""}`, { message, digest, url });
    await sendMail(html, {
      to: OWNER_EMAIL!,
      subject: `Unhandled Error${digest ? ` · ${digest}` : ""}`,
    });

    await redis.set(redisKey(cacheKey), 1, { ex: timeInSec({ day: 1 }) });
  } catch (sendErr) {
    console.error("[notifyErrorAction] Failed to send error notification:", sendErr);
  }
  return out();
};

const redisKey = (cacheKey: string) => `error:notified:${cacheKey}`;

// same input = same output
function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}
