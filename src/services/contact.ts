import { OWNER_EMAIL } from "@/config";
import { sendMail } from "@/libs/email";
import { EmailTemplates } from "@/libs/email/templates";
import { ContactPayload } from "@/payloads/contact";
import { timeInSec } from "@/libs/manipulate/number";
import { ServerError } from "@/libs/error/server";
import { Locale } from "@/i18n/types";
import { createTranslator } from "next-intl";
import { getMessages } from "@/i18n/request";
import { redis } from "@/libs/redis";
import { ActionFunc } from "nectify-js/actions";

export abstract class ContactService {
  static readonly MAX_SEND_MESSAGE = 3; // per hour

  static readonly sendMessage: ActionFunc<[ContactPayload.SendMessage, Locale], [ContactPayload.SendMessage, Locale], void> = async ({
    outcome,
    validated: [{ email, fullName, message, subject }, lang],
  }) => {
    const submitTime = new Date();

    let totalSend = await redis.get<number>(`contact:cta:${email}`);
    if (totalSend === null || totalSend < 0) totalSend = 0;

    if (totalSend >= this.MAX_SEND_MESSAGE) {
      const t = createTranslator({ locale: lang, messages: await getMessages(lang), namespace: "Error.Contact" });
      const err = await new ServerError("TOO_MUCH_REQ", { desc: t("TOO_MUCH_REQ.desc") }).withLocale(lang).flatten();
      return outcome.error(err).fail();
    }

    await sendMail(await EmailTemplates.contactForm({ email, fullName, message, subject, submittedAt: submitTime }, lang), { to: OWNER_EMAIL! });

    // ignorable
    redis
      .pipeline()
      .incr(`contact:cta:${email}`)
      .expire(`contact:cta:${email}`, timeInSec({ hour: 1 }))
      .exec()
      .catch(() => {});
    sendMail(await EmailTemplates.contactFormReply({ fullName, subject }, lang), { to: email }).catch(() => {});

    return outcome.success(undefined).ok();
  };
}
