"use client";
import Logo from "@/components/common/logo";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center px-6">
      <div className="relative max-w-xl w-full text-center rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur shadow-xl">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-3xl animate-pulse">
          <Logo />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white">
          Oops! Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-400">
          We couldn&apos;t complete your request. Please try again or contact
          support if the problem persists.
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href="/dashboard/home"
            className="rounded-xl bg-red-500 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-red-600 transition"
          >
            Go to Dashboard
          </a>
        </div>

        {/* Sub text */}
        <p className="mt-6 text-xs text-gray-500">
          If this keeps happening, please reach out to our support team.
        </p>

        {/* Glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-red-500/20 blur-3xl" />
      </div>
    </div>
  );
}
