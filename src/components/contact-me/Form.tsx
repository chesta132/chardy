"use client";

import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { FormLayout } from "../form/FormLayout";
import { useForm } from "@/hooks/useForm";
import { Button } from "../ui/Button";
import { ContactPayload } from "@/payloads/contact";
import { useState } from "react";
import { toast } from "sonner";
import { Loading } from "../ui/Loading";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/types";
import { sendMessageAction } from "@/actions/contact";

export const ContactMeForm = () => {
  const t = useTranslations("HomeContact.mail");
  const locale = useLocale();

  const formGroup = useForm({ email: "", fullName: "", message: "", subject: "" }, ContactPayload.sendMessage);
  const [loading, setLoading] = useState(false);
  const {
    form: [form],
    resetForm,
  } = formGroup;

  const { textAreaRef } = useAutosizeTextarea(form.message);

  const handleSendMessage = async (_: unknown, form: ContactPayload.SendMessage) => {
    try {
      setLoading(true);
      await sendMessageAction(form, locale as Locale);
      toast.info("Message sent successfully!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout form={formGroup} onFormSubmit={handleSendMessage} className="space-y-4 w-full lg:w-2xl p-5 font-neue-montreal" noValidate>
      <div className="flex flex-col">
        <label htmlFor="fullName" className="font-neue-montreal reveal-text">
          {t("fullName")} <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <FormLayout.input
          id="fullName"
          field="fullName"
          placeholder={t("placeholders.name")}
          className="w-full outline-none border-b transition-all p-2 lg:pl-0"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="font-neue-montreal reveal-text">
          {t("email")} <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <FormLayout.input
          id="email"
          field="email"
          placeholder={t("placeholders.email")}
          className="w-full outline-none border-b transition-all p-2 lg:pl-0"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="subject" className="font-neue-montreal reveal-text">
          {t("subject")} <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <FormLayout.input
          id="subject"
          field="subject"
          placeholder={t("placeholders.subject")}
          className="w-full outline-none border-b transition-all p-2 lg:pl-0"
          type="text"
          required
          aria-required="true"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="message" className="font-neue-montreal reveal-text">
          {t("message")} <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <FormLayout.textarea
          ref={textAreaRef}
          id="message"
          field="message"
          placeholder={t("placeholders.message")}
          className="w-full outline-none border-b transition-all p-2 lg:pl-0 leading-5"
          required
          aria-required="true"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex gap-2 justify-center lg:justify-start">
          <Button disabled={loading} type="submit" aria-busy={loading}>
            {t("send")}
          </Button>
          <Button disabled={loading} onClick={resetForm} type="button" withoutArrow>
            {t("reset")}
          </Button>
        </div>
        <div className="flex justify-center lg:justify-start" aria-live="polite" aria-label={loading ? "Sending message..." : ""}>
          {loading && <Loading className="invert-50 h-10" />}
        </div>
      </div>
    </FormLayout>
  );
};
