import { setupUserAction } from "@/lib/server/actions/billing/setup-user-action";
import { redirect, RedirectType } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function SetupPage() {
  await setupUserAction();
  redirect("/dashboard/home", RedirectType.replace);
}
