"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative size-10 overflow-hidden hover:bg-secondary! cursor-pointer"
    >
      {/* Sun */}
      <Sun
        className={`absolute size-6 transition-all duration-300
          ${
            isDark
              ? "-translate-y-4 opacity-0 scale-90"
              : "translate-y-0 opacity-100 scale-100"
          }
        `}
      />

      {/* Moon */}
      <Moon
        className={`absolute size-6 transition-all duration-300
          ${
            isDark
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-90"
          }
        `}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
