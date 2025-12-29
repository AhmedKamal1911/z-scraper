import { waitFor } from "@/lib/helper-utils/wait-for";
import Link from "next/link";

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center px-6">
      <div className="relative max-w-xl w-full text-center rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-3xl">
          🚧
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold">Landing Page in Progress</h1>

        {/* Description */}
        <p className="mt-4 text-gray-400">
          We’re currently building a better experience for you. The dashboard is
          fully functional and ready to use.
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/home"
            className="rounded-xl bg-indigo-500 px-8 py-4 text-base font-semibold hover:bg-indigo-600 transition"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Sub text */}
        <p className="mt-6 text-xs text-gray-500">
          This page will be updated soon.
        </p>

        {/* Glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-indigo-500/20 blur-3xl" />
      </div>
    </div>
  );
}
