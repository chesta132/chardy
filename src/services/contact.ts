import { OWNER_EMAIL } from "@/config";
import { sendMail } from "@/libs/email";
import { EmailTemplates } from "@/libs/email/templates";
import { ContactPayload } from "@/payloads/contact";
import { Locale } from "@/i18n/types";
import { ActionFunc } from "nectic/actions";
import { TurnstilePayload } from "@/payloads/turnstile";

export abstract class ContactService {
  static readonly MAX_SEND_MESSAGE = 3; // per hour

  static readonly sendMessage: ActionFunc<
    [TurnstilePayload.Validator, ContactPayload.SendMessage, Locale],
    [TurnstilePayload.Validator, ContactPayload.SendMessage, Locale],
    void
  > = async ({ outcome, validated: [{}, { email, fullName, message, subject }, lang] }) => {
    const submitTime = new Date();
    await sendMail(await EmailTemplates.contactForm({ email, fullName, message, subject, submittedAt: submitTime }, lang), {
      to: OWNER_EMAIL!,
    });

    // ignorable
    sendMail(await EmailTemplates.contactFormReply({ fullName, subject }, lang), { to: email }).catch(() => {});

    return outcome.success(undefined).ok();
  };
}
