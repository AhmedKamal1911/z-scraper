"use client";
import TooltipWrapper from "@/components/common/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import ExecuteWorkflowBtn from "./execute-workflow-btn";
import NavigationTabs from "./navigation-tabs";
import PublishWorkflowBtn from "./publish-workflow-btn";
import SaveWorkflowEditsBtn from "./save-workflow-edits-btn";
import UnPublishWorkflowBtn from "./unpublish-workflow-btn";
type Props = {
  title: string;
  subTitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
};
export default function WorkflowTopbar({
  title,
  subTitle,
  workflowId,
  hideButtons = false,
  isPublished,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <header
      className={`flex justify-between items-center gap-2 p-2 min-h-[70px] bg-background border-b border-accent sticky top-0 z-50 ${
        hideButtons ? "max-[530px]:flex-col" : "max-[1120px]:flex-col"
      }  max-lg:gap-4 shadow-sm`}
    >
      <div className="flex max-[300px]:gap-2 gap-5">
        <TooltipWrapper content="Back">
          <Button
            className="cursor-pointer"
            variant="outline"
            size="icon"
            onClick={() => {
              if (pathname.includes("/runs")) {
                router.push(`/dashboard/workflow/editor/${workflowId}`);
              } else {
                router.push("/dashboard/workflows");
              }
            }}
          >
            <ChevronLeft className="size-7" />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold truncate capitalize">{title}</p>
          {subTitle && (
            <span className="text-xs text-muted-foreground truncate max-[300px]:text-wrap">
              {subTitle}
            </span>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      {!hideButtons && (
        <div className="flex items-center gap-3 max-[300px]:self-center max-[330px]:flex-col max-[330px]:items-stretch!">
          <ExecuteWorkflowBtn workflowId={workflowId} />
          {!isPublished && <SaveWorkflowEditsBtn workflowId={workflowId} />}
          {isPublished ? (
            <UnPublishWorkflowBtn workflowId={workflowId} />
          ) : (
            <PublishWorkflowBtn workflowId={workflowId} />
          )}
        </div>
      )}
    </header>
  );
}
