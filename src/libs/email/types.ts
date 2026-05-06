export type ContactFormPayload = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  submittedAt?: Date;
};

export type ContactFormReplyPayload = {
  fullName: string;
  subject: string;
};
