import Logo from "@/components/common/logo";
import { Loader2 } from "lucide-react";

export default function SetupLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-background shadow-xl p-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="scale-90 sm:scale-100 animate-pulse">
          <Logo />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          Setting up your account
        </h1>

        {/* Description */}
        <p className="text-center text-sm text-gray-400 max-w-xs">
          We are preparing your workspace, adding initial credits, and
          configuring your settings. This will just take a few seconds.
        </p>

        {/* Loader */}
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    </div>
  );
}
