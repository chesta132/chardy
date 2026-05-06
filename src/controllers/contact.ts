import { OWNER_EMAIL } from "@/config";
import { sendMail } from "@/libs/email";
import { EmailTemplates } from "@/libs/email/templates";
import { ApiRequest, Handler } from "@/libs/route/types";
import { ContactPayload } from "@/payloads/contact";

export abstract class ContactController {
  // TODO: add max send msg
  static readonly sendMessage: Handler<ApiRequest<ContactPayload.SendMessageBody>, null> = async (req, { reply }) => {
    const submitTime = new Date();
    const { email, fullName, message, subject } = req.body;

    await sendMail(EmailTemplates.contactForm({ email, fullName, message, subject, submittedAt: submitTime }), { to: OWNER_EMAIL! });
    // ignorable
    sendMail(EmailTemplates.contactFormReply({ fullName, subject }), { to: email }).catch(() => {});

    reply.success(null).ok();
  };
}
