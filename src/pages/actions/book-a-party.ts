import type { APIRoute } from "astro";
import { sendEmail } from "../../utils/emails";
import siteConfig from "../../content/config/config.json";
import formConfig from "../../content/config/book-a-party.json";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const recaptchaToken = formData.get("recaptchaToken") as string | null;

  if (process.env.RECAPTCHA_SECRET_KEY) {
    if (!recaptchaToken) {
      return new Response(
        JSON.stringify({ error: "reCAPTCHA verification is required" }),
        { status: 400 }
      );
    }

    try {
      const verifyResponse = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken,
          }),
        }
      );
      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        return new Response(
          JSON.stringify({ error: "reCAPTCHA verification failed" }),
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return new Response(
        JSON.stringify({ error: "reCAPTCHA verification error" }),
        { status: 500 }
      );
    }
  }

  // Collect and validate fields from config
  const values: Record<string, string> = {};
  for (const field of formConfig.fields) {
    const value = (formData.get(field.name) as string | null) || null;
    if (field.required && !value) {
      return new Response(
        JSON.stringify({ error: `Missing required field: ${field.label}` }),
        { status: 400 }
      );
    }
    values[field.name] = value || "";
  }

  const email = values.recipient;
  const name = values.name;

  // Build the owner email from config fields
  const rows = formConfig.fields
    .map(
      (field) =>
        `<tr><td style="padding:4px 8px;font-weight:bold;">${field.label}:</td><td style="padding:4px 8px;">${values[field.name] || "—"}</td></tr>`
    )
    .join("\n");

  try {
    const ownerHtml = `
      <div>
        <h2 style="font-family:roboto,sans-serif;">New party enquiry</h2>
        <table style="font-size:1rem;font-family:roboto,sans-serif;border-collapse:collapse;">
          ${rows}
        </table>
      </div>`;
    await sendEmail({
      to: siteConfig.mailTo,
      subject: formConfig.ownerEmailSubject.replace("{name}", name),
      html: ownerHtml,
    });
  } catch (error) {
    console.error("Failed to send owner email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send enquiry" }),
      { status: 500 }
    );
  }

  // Confirmation email to the enquirer
  try {
    const customerHtml = `
      <div>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          Hi ${name},
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          Thanks for your interest in an <b>eco-fashion birthday party</b> with WE MAKE Kids Club!
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          We've received your enquiry and will get back to you shortly with more details.
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          In the meantime, feel free to reach out at
          <a href="mailto:${siteConfig.mailTo}">${siteConfig.mailTo}</a>
          if you have any questions.
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          Can't wait to create together!
        </p>
        <b>Aurélie</b><br>
        <span style="font-size:1rem;font-family:roboto,sans-serif;">Founder of WE MAKE Kids Club</span>
      </div>`;
    await sendEmail({
      to: email,
      subject: formConfig.customerEmailSubject,
      html: customerHtml,
    });
  } catch (error) {
    console.error("Failed to send customer email:", error);
  }

  return new Response(
    JSON.stringify({ message: "Success!", redirect: "/success" }),
    { status: 200 }
  );
};
