import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a new account to get started and set up your workspace in just a few steps.",
};
export default function SignUpPage() {
  return <SignUp oauthFlow="popup" forceRedirectUrl={"/setup"} />;
}
