import { createTransport, type Transporter } from "nodemailer";

type SendEmailOptions = {
  /** Email address of the recipient */
  to: string;
  /** Subject line of the email */
  subject: string;
  /** Message used for the body of the email */
  html: string;
  /** Optional message headers */
  headers?: Record<string, string>;
};

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const transporter = await getEmailTransporter();
  const { to, subject, html, headers } = options;
  const from = import.meta.env.SEND_EMAIL_FROM;
  const info = await transporter.sendMail({ to, subject, html, from, headers });
  console.log("Message sent:", info.messageId);
}

async function getEmailTransporter(): Promise<Transporter> {
  if (!import.meta.env.RESEND_API_KEY) {
    throw new Error("Missing Resend configuration");
  }

  return createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: { user: "resend", pass: import.meta.env.RESEND_API_KEY },
  });
}
