"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Logo from "@/components/common/logo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-1 sm:px-6 text-foreground">
      <Card className="w-full max-w-lg rounded-2xl border-border text-center shadow-lg">
        {/* Header */}
        <CardHeader>
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>

          <CardTitle className="text-2xl font-semibold">
            Something went wrong
          </CardTitle>

          <CardDescription className="text-sm">{error.message}</CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent className="text-sm text-muted-foreground">
          An unexpected error occurred while loading this page. You can try
          again or refresh the page.
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col items-center gap-6">
          <Button variant={"destructive"} onClick={reset}>
            <RotateCcw className="size-4" />
            Try again
          </Button>

          <div className="flex max-sm:flex-col items-center gap-2 text-xs text-muted-foreground">
            <Logo />
            <span>If the problem persists, contact support</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
