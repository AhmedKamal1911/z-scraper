import { waitFor } from "@/lib/helper-utils/wait-for";
import { setupUserAction } from "@/lib/server/actions/billing/setup-user-action";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  await waitFor(3000);
  await setupUserAction();
  redirect("/dashboard/home");
}
