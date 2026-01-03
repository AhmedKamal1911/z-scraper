"use client";
import { cn } from "@/lib/utils";
import { Waypoints } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logo() {
  const path = usePathname();

  return (
    <Link
      href={"/"}
      className={`text-2xl  flex justify-center items-center gap-2`}
    >
      <div className="rounded-lg bg-primary text-white p-1">
        <Waypoints className="size-6 stroke-white" />
      </div>

      <div className="flex capitalize font-bold">
        <span className="text-primary">Z</span>
        <span
          className={cn(
            "text-accent-foreground",
            (path === "/sign-up" || path === "/sign-in") && "text-black!"
          )}
        >
          scraper
        </span>
      </div>
    </Link>
  );
}
