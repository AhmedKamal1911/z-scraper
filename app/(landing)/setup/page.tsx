import { setupUserAction } from "@/lib/server/actions/billing/setup-user-action";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Setting up your account",
  description: "Finalizing your account setup. You will be redirected shortly.",
};
export default async function SetupPage() {
  await setupUserAction();
  redirect("/dashboard/home", RedirectType.replace);
}
