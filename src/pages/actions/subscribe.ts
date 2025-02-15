import type { APIRoute } from "astro";
import { appendData, authenticate } from "../../utils/sheet";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  // Get the form data submitted by the user on the home page
  const formData = await request.formData();
  const email = formData.get("recipient") as string | null;
  const name = formData.get("name") as string | null;
  const selectedWorkshops = formData.getAll("selectedWorkshops") as
    | string[]
    | null;
  const message = selectedWorkshops?.join(", ") ?? '';

  // Throw an error if we're missing any of the needed fields.
  if (!email || !name || !selectedWorkshops || selectedWorkshops.length === 0) {
    throw new Error("Missing required fields");
  }

  const auth = await authenticate();

  try {
    const values: (string)[][] = [
      [name, email, message]
    ];
    await appendData(auth, values);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  return redirect("/success");
};
