import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-128px)] items-center justify-center stroke-primary capitalize">
      <LoaderCircle className="animate-spin size-12 text-primary" />
      <span className="text-xl">loading please wait ..</span>
    </div>
  );
}
