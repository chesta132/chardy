import nodemailer from "nodemailer";
import { APP_NAME, MAILER_FROM, MAILER_HOST, MAILER_PASS, MAILER_USER } from "@/config";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: MAILER_HOST,
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});

type SendMailOptions = Omit<Mail.Options & Partial<SMTPTransport.Options>, "html" | "from"> & { to: string };
export const sendMail = (html: string, options: SendMailOptions) => {
  options.subject ||= `${APP_NAME} Notification`;
  return transporter.sendMail({ ...options, html, from: MAILER_FROM });
};
