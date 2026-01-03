import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotfoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <h1 className="text-[6rem] font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent select-none">
        404
      </h1>

      <p className="mt-4 text-lg text-muted-foreground text-center max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Button className="mt-8 px-6 py-2 text-base rounded-lg shadow-md hover:shadow-lg transition-all">
        <ArrowLeft />
        <Link href="/dashboard/home">Go back home</Link>
      </Button>

      <div className="absolute bottom-6 text-sm text-muted-foreground/70">
        © {new Date().getFullYear()} ZScraper
      </div>
    </div>
  );
}
