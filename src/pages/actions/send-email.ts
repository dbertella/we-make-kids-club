import type { APIRoute } from "astro";
import { sendEmail } from "../../utils/emails";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  // Get the form data submitted by the user on the home page
  const formData = await request.formData();
  const email = formData.get("recipient") as string | null;
  const name = formData.get("name") as string | null;
  const selectedWorkshops = formData.getAll("selectedWorkshops") as
    | string[]
    | null;
  const message = selectedWorkshops?.join(", ");

  // Throw an error if we're missing any of the needed fields.
  if (!email || !name || !selectedWorkshops || selectedWorkshops.length === 0) {
    throw new Error("Missing required fields");
  }

  // Try to send the email using a `sendEmail` function we'll create next. Throw
  // an error if it fails.
  try {
    const html = `
    <div>Name: ${name}</div>
    <div>Email: ${email}</div>
    <div>${message}</div>`;
    await sendEmail({
      to: "wemakekidsclub@gmail.com",
      subject: "[wemakekidsclub.com] New subscription",
      html,
    });
  } catch (error) {
    throw new Error("Failed to send email");
  }

  // // Redirect the user to a success page after the email is sent.
  return redirect("/success");
};
