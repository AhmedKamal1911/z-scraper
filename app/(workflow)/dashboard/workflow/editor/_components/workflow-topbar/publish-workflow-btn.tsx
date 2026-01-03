import useExecutionPlan from "@/hooks/use-execution-plan";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEdges, useNodes } from "@xyflow/react";

import { publishWorkflowAction } from "@/lib/server/actions/workflows/publish-workflow-action";

export default function PublishWorkflowBtn({
  workflowId,
}: {
  workflowId: string;
}) {
  const generateWorkflowPlan = useExecutionPlan();

  const nodes = useNodes();
  const edges = useEdges();
  const flowDefinition = JSON.stringify({ nodes, edges });
  const mutation = useMutation({
    mutationFn: publishWorkflowAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: () => {
      toast.success("Workflow Published Successfully", {
        id: "publish-workflow",
      });
    },
    onError: (error) => {
      toast.error(error.message, { id: "publish-workflow" });
    },
  });
  return (
    <Button
      variant={"outline"}
      className=" capitalize"
      disabled={mutation.isPending}
      onClick={() => {
        if (!onlineManager.isOnline()) {
          toast.error("Check network connection", { id: workflowId });
          return;
        }
        const { executionPlan, error } = generateWorkflowPlan();
        if (error) {
          const hasMissingInputs = Array.isArray(error.invalidElements);
          if (hasMissingInputs) {
            toast.error(
              <div>
                <p>Cannot execute workflow. Missing inputs:</p>
                <ul className="ml-4 list-disc">
                  {error.invalidElements!.map((node, index) => (
                    <li key={index}>[{node.inputs.join(", ")}]</li>
                  ))}
                </ul>
              </div>,
              {
                duration: 8000,

                id: "publish-workflow",
              }
            );
          }
          return;
        }

        if (executionPlan && executionPlan.length === 0) {
          toast.error(
            "Cannot generate workflow plan. Please check your workflow inputs.",
            {
              duration: 5000,
              id: "publish-workflow",
            }
          );
          return;
        }

        toast.loading("Publishing Workflow...", {
          id: "publish-workflow",
        });
        mutation.mutate({
          workflowId,
          definition: flowDefinition,
        });
        console.log("---plan --");
        console.table({ executionPlan });
      }}
    >
      <Upload className="text-primary" />
      {mutation.isPending ? "publishing..." : "publish"}
    </Button>
  );
}
