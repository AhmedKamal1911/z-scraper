import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your account to access your dashboard and manage your workspace.",
};

export default function SignInPage() {
  return <SignIn forceRedirectUrl={"/dashboard/home"} oauthFlow="popup" />;
}
