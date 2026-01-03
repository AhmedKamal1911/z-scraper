import { LoaderCircle } from "lucide-react";
import React from "react";

export default function loading() {
  return (
    <div className="flex h-[calc(100vh-57px)] w-full items-center justify-center">
      <LoaderCircle className="animate-spin size-12 text-primary" />
    </div>
  );
}
