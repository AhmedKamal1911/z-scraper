import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavigationTabs({ workflowId }: { workflowId: string }) {
  const pathname = usePathname();
  const activePath = pathname?.split("/")[3];

  return (
    <Tabs
      value={activePath}
      className="w-[200px] md:w-[300px]  xl:w-[400px]"
      defaultValue="account"
    >
      <TabsList className="w-full grid grid-cols-2 capitalize">
        <Link href={`/dashboard/workflow/editor/${workflowId}`}>
          <TabsTrigger
            value="editor"
            className="w-full font-semibold cursor-pointer dark:data-[state=active]:bg-primary!"
          >
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/dashboard/workflow/runs/${workflowId}`}>
          <TabsTrigger
            value="runs"
            className="w-full font-semibold cursor-pointer dark:data-[state=active]:bg-primary!"
          >
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}
