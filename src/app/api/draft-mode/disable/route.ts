import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const dm = await draftMode();
  dm.disable();
  const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";
  redirect(redirectTo);
}
