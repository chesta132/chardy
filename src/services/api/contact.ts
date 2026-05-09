import { OWNER_EMAIL } from "@/config";
import { sendMail } from "@/libs/email";
import { EmailTemplates } from "@/libs/email/templates";
import { ContactPayload } from "@/payloads/contact";
import { getPayload } from "payload";
import config from "@payload-config";
import { timeInMs } from "@/libs/manipulate/number";
import { ServerError } from "@/libs/error/server";

export abstract class ContactService {
  static readonly MAX_SEND_MESSAGE = 3; // per hour

  static readonly sendMessage = async ({ email, fullName, message, subject }: ContactPayload.SendMessageBody) => {
    const submitTime = new Date();
    const oneHourAgo = new Date(Date.now() - timeInMs({ hour: 1 }));
    const payload = await getPayload({ config });

    await payload.delete({ collection: "contact-rate-limit", where: { sentAt: { less_than: oneHourAgo } }, select: { sentAt: true } });

    const { totalDocs } = await payload.find({
      collection: "contact-rate-limit",
      where: { email: { equals: email } },
      select: { email: true },
      limit: this.MAX_SEND_MESSAGE,
    });

    if (totalDocs >= this.MAX_SEND_MESSAGE) {
      throw new ServerError("TOO_MUCH_REQ", { desc: "Please send another message later." });
    }

    await sendMail(EmailTemplates.contactForm({ email, fullName, message, subject, submittedAt: submitTime }), { to: OWNER_EMAIL! });

    // ignorable
    payload.create({ collection: "contact-rate-limit", data: { email, sentAt: submitTime.toISOString() } });
    sendMail(EmailTemplates.contactFormReply({ fullName, subject }), { to: email }).catch(() => {});

    return null;
  };
}
