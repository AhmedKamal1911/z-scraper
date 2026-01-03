"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/common/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, Play, ShuffleIcon, Trash } from "lucide-react";
import Link from "next/link";
import { Workflow } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { useRunWorkflow } from "@/hooks/use-run-workflow";
import { useDuplicateWorkflow } from "@/hooks/use-duplicate-workflow";
import DuplicateWorkflowDialog from "./dialogs/duplicate-workflow-dialog";

export default function WorkflowMenu({
  workflow,
  setOpenDeleteDialog,
}: {
  workflow: Workflow;
  setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const { runWorkflow, isRunning } = useRunWorkflow(workflow.id);

  const { form, isPending, onSubmit, open, setOpen } = useDuplicateWorkflow(
    workflow.id
  );
  return (
    <DropdownMenu>
      <TooltipWrapper content="Workflow Actions">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Open menu"
            size="icon"
            className="size-[30px] cursor-pointer"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent className="w-36" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={isRunning}
            onClick={runWorkflow}
            className={`min-[960px]:hidden`}
            asChild
          >
            <div role="button" className={"flex items-center gap-2 capitalize"}>
              <Play size={16} />
              run
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className={`min-[960px]:hidden`} asChild>
            <Link
              className={"flex items-center gap-2 capitalize"}
              href={`/dashboard/workflow/editor/${workflow.id}`}
            >
              <ShuffleIcon size={16} />
              edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-[960px]:hidden"
            onSelect={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <Copy size={16} />
            duplicate
          </DropdownMenuItem>
          <DuplicateWorkflowDialog
            form={form}
            isPending={isPending}
            onSubmit={onSubmit}
            open={open}
            setOpen={setOpen}
            hidden
          />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => {
              setOpenDeleteDialog((prev) => !prev);
            }}
          >
            <Trash /> Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
