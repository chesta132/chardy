import { APP_DOMAIN, APP_NAME, APP_URL, REGION } from "@/config";
import { ContactFormPayload, ContactFormReplyPayload } from "./types";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/types";
import { getServerTranslations } from "@/i18n/server";

const C = {
  shell: (content: string) => /* html */ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background-color:#f5f0e9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e9;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
                ${content}
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,

  header: (badge: string) => /* html */ `
    <tr>
      <td style="background-color:#0a0a0a;padding:24px 36px;border-radius:12px 12px 0 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <img src="${APP_URL}/logo.png" alt="${APP_NAME}" height="28" style="display:block;" />
            </td>
            <td align="right">
              <span style="font-size:10px;color:#6b6560;letter-spacing:0.1em;text-transform:uppercase;">
                ${badge}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `,

  accentStripe: () => /* html */ `
    <tr>
      <td style="background-color:#ff4d1d;padding:3px 0;"></td>
    </tr>
  `,

  subheaderBar: (text: string) => /* html */ `
    <tr>
      <td style="background-color:#ede7df;padding:10px 36px;border-left:0.5px solid #d4cfc8;border-right:0.5px solid #d4cfc8;">
        <span style="font-size:11px;color:#6b6560;letter-spacing:0.05em;">${text}</span>
      </td>
    </tr>
  `,

  body: (content: string) => /* html */ `
    <tr>
      <td style="background-color:#ffffff;padding:40px 36px;border-left:0.5px solid #d4cfc8;border-right:0.5px solid #d4cfc8;">
        ${content}
      </td>
    </tr>
  `,

  footer: (text: string) => /* html */ `
    <tr>
      <td style="background-color:#0a0a0a;padding:20px 36px;border-radius:0 0 12px 12px;">
        <p style="margin:0;font-size:11px;color:#6b6560;line-height:1.6;">${text}</p>
      </td>
    </tr>
  `,

  label: (text: string) => /* html */ `
    <p style="margin:0 0 8px;font-size:10px;font-weight:500;color:#ff4d1d;letter-spacing:0.14em;text-transform:uppercase;">
      ${text}
    </p>
  `,

  heading: (text: string) => /* html */ `
    <h1 style="margin:0 0 24px;font-size:24px;font-weight:500;color:#0a0a0a;text-transform:uppercase;letter-spacing:-0.01em;line-height:1.2;">
      ${text}
    </h1>
  `,

  divider: () => /* html */ `
    <hr style="border:none;border-top:0.5px solid #d4cfc8;margin:0 0 24px;" />
  `,

  paragraph: (text: string) => /* html */ `
    <p style="margin:0 0 16px;font-size:14px;color:#3a3630;line-height:1.75;">${text}</p>
  `,

  infoBox: (title: string, text: string) => /* html */ `
    <div style="background-color:#f5f0e9;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:11px;color:#6b6560;letter-spacing:0.06em;text-transform:uppercase;">${title}</p>
      <p style="margin:0;font-size:13px;color:#3a3630;line-height:1.7;">${text}</p>
    </div>
  `,

  button: (href: string, text: string, variant: "primary" | "dark" = "primary") => {
    const bg = variant === "primary" ? "#ff4d1d" : "#0a0a0a";
    const color = variant === "primary" ? "#ffffff" : "#f5f0e9";
    return /* html */ `
      <a href="${href}" style="display:inline-block;background-color:${bg};color:${color};font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:13px 28px;border-radius:8px;">
        ${text}
      </a>
    `;
  },

  metaTable: (rows: { label: string; value: string; isLink?: boolean }[]) => {
    const tds = rows
      .map(
        (row, i) => /* html */ `
        <tr>
          <td style="padding:10px 0;${i < rows.length - 1 ? "border-bottom:0.5px solid #ede7df;" : ""}width:120px;">
            <span style="font-size:11px;color:#6b6560;letter-spacing:0.06em;text-transform:uppercase;">${row.label}</span>
          </td>
          <td style="padding:10px 0;${i < rows.length - 1 ? "border-bottom:0.5px solid #ede7df;" : ""}">
            ${
              row.isLink
                ? `<a href="${row.value}" style="font-size:13px;color:#ff4d1d;text-decoration:none;">${row.value}</a>`
                : `<span style="font-size:13px;color:#0a0a0a;font-weight:500;">${row.value}</span>`
            }
          </td>
        </tr>
      `,
      )
      .join("");

    return /* html */ `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        ${tds}
      </table>
    `;
  },

  messageBlock: (text: string) => /* html */ `
    <p style="margin:0 0 10px;font-size:11px;color:#6b6560;letter-spacing:0.06em;text-transform:uppercase;">Message</p>
    <div style="background-color:#f5f0e9;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;font-size:14px;color:#3a3630;line-height:1.75;white-space:pre-wrap;">${text}</p>
    </div>
  `,
};

export class EmailTemplates {
  static async contactForm(payload: ContactFormPayload, locale: Locale): Promise<string> {
    const { fullName, email, subject, message, submittedAt = new Date() } = payload;
    const t = await getServerTranslations(locale);

    const date = submittedAt.toLocaleDateString(REGION, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const time = submittedAt.toLocaleTimeString(REGION, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });

    return C.shell(
      `
      ${C.header(t("Email.contactForm.badge"))}
      ${C.subheaderBar(`${date} &nbsp;&middot;&nbsp; ${time}`)}
      ${C.body(`
        ${C.label(t("Email.contactForm.label"))}
        ${C.heading(t("Email.contactForm.heading"))}
        ${C.divider()}
        ${C.metaTable([
          { label: t("Email.contactForm.meta.from"), value: fullName },
          { label: t("Email.contactForm.meta.email"), value: email },
          { label: t("Email.contactForm.meta.subject"), value: subject },
        ])}
        ${C.messageBlock(message)}
        ${C.button(`mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`, t("Email.contactForm.replyButton", { name: fullName }), "primary")}
      `)}
      ${C.footer(t("Email.contactForm.footer", { domain: APP_DOMAIN }))}
    `,
    ).trim();
  }

  static async contactFormReply(payload: ContactFormReplyPayload, locale: Locale): Promise<string> {
    const { fullName, subject } = payload;
    const firstName = fullName.trim().split(" ")[0];
    const t = await getServerTranslations(locale);

    return C.shell(
      `
      ${C.header(t("Email.contactFormReply.badge"))}
      ${C.accentStripe()}
      ${C.body(`
        ${C.label(t("Email.contactFormReply.label"))}
        ${C.heading(t("Email.contactFormReply.heading", { firstName }))}
        ${C.divider()}
        ${C.paragraph(t("Email.contactFormReply.body.line1", { subject: `<strong style="color:#0a0a0a;font-weight:500;">&ldquo;${subject}&rdquo;</strong>` }))}
        ${C.paragraph(t("Email.contactFormReply.body.line2"))}
        ${C.infoBox(t("Email.contactFormReply.infoBox.title"), t("Email.contactFormReply.infoBox.text"))}
        ${C.button(APP_URL, t("Email.contactFormReply.ctaButton"), "dark")}
      `)}
      ${C.footer(t("Email.contactFormReply.footer", { domain: APP_DOMAIN }))}
    `,
    ).trim();
  }
}
