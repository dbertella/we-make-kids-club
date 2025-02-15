import type { APIRoute } from "astro";
import { appendData, authenticate } from "../../utils/sheet";
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
  const message = selectedWorkshops?.join(", ") ?? "";

  // Throw an error if we're missing any of the needed fields.
  if (!email || !name || !selectedWorkshops || selectedWorkshops.length === 0) {
    throw new Error("Missing required fields");
  }

  const auth = await authenticate();

  try {
    const values: string[][] = [[name, email, message]];
    await appendData(auth, values);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  try {
    const html = `
      <div>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>Hi ${name},</span>
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>Thank you for subscribing to </span>
          <b>WE MAKE kids club</b>
          <span>—where creativity meets sustainability! <img style="width:1rem;height:1rem" data-emoji="🌿" class="an1" alt="🌿" aria-label="🌿" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f33f/72.png" loading="lazy">
            <img style="width:1rem;height:1rem" data-emoji="🎨" class="an1" alt="🎨" aria-label="🎨" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f3a8/72.png" loading="lazy">
            <img style="width:1rem;height:1rem" data-emoji="♻️" class="an1" alt="♻️" aria-label="♻️" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/16.0/267b_fe0f/72.png" loading="lazy">
          </span>
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>You’re now part of a community that’s all about </span>
          <b>upcycling, crafting, and making fashion fun and eco-friendly</b>
          <span> for kids.</span>
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>
            <img style="width:1rem;height:1rem" data-emoji="✨" class="an1" alt="✨" aria-label="✨" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/16.0/2728/72.png" loading="lazy">
          </span>
          <b>What to expect in your monthly newsletter?</b>
          <span>
            <br>
          </span>
          <span>
            <img style="width:1rem;height:1rem" data-emoji="📅" class="an1" alt="📅" aria-label="📅" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f4c5/72.png" loading="lazy"> Stay tuned for upcoming workshops &amp; events. </span>
          <spa>
            <br>
          </span>
          <span>
            <img style="width:1rem;height:1rem" data-emoji="🎨" class="an1" alt="🎨" aria-label="🎨" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f3a8/72.png" loading="lazy"> Get DIY craft ideas to try at home. </span>
          <spa>
            <br>
          </span>
          <span>
            <img style="width:1rem;height:1rem" data-emoji="💚" class="an1" alt="💚" aria-label="💚" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/16.0/1f49a/72.png" loading="lazy"> Learn simple ways to make fashion more sustainable. </span>
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>Talking about sustainability… </span>
          <span>Do you know the number 1 thing in your house that you need to stop throwing away starting today and why?</span>
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>Fabric! Even if it’s old, stained, with holes, or in small pieces. Doesn’t matter.</span>
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>Landfills all over the world are already full of it and I will share with you literally TONS of ways to use them (old clothes and fabric scraps) with your kid(s). And if that’s not enough to convince you, I’m putting in place a system to reward people who come to me with fabric scraps/old clothes!</span>
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>Follow us on </span>
          <span>
            <a href="https://www.instagram.com/wemakekidsclub/" target="_blank">Instagram</a>
          </span>
          <span> for more inspiration!</span>
        </p>
        <p style="font-size:1rem;font-family:roboto,sans-serif;">
          <span>Can’t wait to create together!</span>
        </p>
        <b>Aurélie</b>
        <span>
          <br>
        </span>
        <span>Founder of WE MAKE kids club</span>
      </div>
     `;
    await sendEmail({
      to: email,
      subject: "Thanks for joining WE MAKE Kids Club!",
      html,
    });
  } catch (error) {
    throw new Error("Failed to send customer email");
  }

  return redirect("/success");
};
