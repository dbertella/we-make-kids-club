import { google, Auth } from "googleapis";

export async function authenticate(): Promise<Auth.OAuth2Client> {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GCP_PRIVATE_KEY as string).replace(
        /\\n/g,
        "\n"
      ),
    },
    projectId: process.env.GCP_PROJECT_ID,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return (await auth.getClient()) as Auth.OAuth2Client;
}

export async function appendData(
  auth: Auth.OAuth2Client,
  values: (string | number)[][]
): Promise<void> {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: import.meta.env.GOOGLE_SHEETS_ID as string,
      range: import.meta.env.WRITE_GOOGLE_SHEETS_RANGE as string,
      valueInputOption: "RAW",
      requestBody: { values },
    });
    console.log(`${result.data.updates?.updatedCells} cells updated.`);
  } catch (error) {
    console.error("Error appending data:", error);
  }
}

// async function readData(auth: Auth.OAuth2Client) {
//   const sheets = google.sheets({ version: "v4", auth });
//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: import.meta.env.GOOGLE_SHEETS_ID as string,
//     range: import.meta.env.READ_GOOGLE_SHEETS_RANGE as string,
//   });
//   const rows = res.data.values;
//   if (!rows || rows.length === 0) {
//     console.log("No data found.");
//     return;
//   }
//   return res;
// }
