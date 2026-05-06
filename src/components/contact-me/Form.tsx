"use client";

import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { FormLayout } from "../form/FormLayout";
import { useForm } from "@/hooks/useForm";
import { Button } from "../ui/Button";
import { ContactPayload } from "@/payloads/contact";
import { useState } from "react";
import { api } from "@/libs/api/apiClient";
import { toast } from "sonner";

export const ContactMeForm = () => {
  const formGroup = useForm({ email: "", fullName: "", message: "", subject: "" }, ContactPayload.sendMessage.body);
  const [loading, setLoading] = useState(false);
  const {
    form: [form],
    resetForm,
  } = formGroup;

  const { textAreaRef } = useAutosizeTextarea(form.message);

  const handleSendMessage = async (_: unknown, form: ContactPayload.SendMessageBody) => {
    try {
      setLoading(true);
      await api.post("/contact", { data: form });
      toast.info("Message sent successfully!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout form={formGroup} onFormSubmit={handleSendMessage} className="space-y-4 w-full lg:w-2xl p-5 font-neue-montreal">
      <div className="flex flex-col">
        <label htmlFor="fullName" className="font-neue-montreal reveal-text">
          Your Full Name
        </label>
        <FormLayout.input
          id="fullName"
          field="fullName"
          placeholder="First Last"
          className="w-full outline-none border-b transition-all p-2 lg:pl-0"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="font-neue-montreal reveal-text">
          Your Email
        </label>
        <FormLayout.input
          id="email"
          field="email"
          placeholder="example@email.com"
          className="w-full outline-none border-b transition-all p-2 lg:pl-0"
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="subject" className="font-neue-montreal reveal-text">
          Subject
        </label>
        <FormLayout.input
          id="subject"
          field="subject"
          placeholder="What's on your mind?"
          className="w-full outline-none border-b transition-all p-2 lg:pl-0"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="message" className="font-neue-montreal reveal-text">
          Message
        </label>
        <FormLayout.textarea
          ref={textAreaRef}
          id="message"
          field="message"
          placeholder="Tell me more...."
          className="w-full outline-none border-b transition-all p-2 lg:pl-0 leading-5"
        />
      </div>
      <div className="flex gap-2 justify-center lg:justify-start">
        <Button disabled={loading} type="submit">
          Send
        </Button>
        <Button disabled={loading} onClick={resetForm} type="button">
          Reset
        </Button>
      </div>
    </FormLayout>
  );
};
