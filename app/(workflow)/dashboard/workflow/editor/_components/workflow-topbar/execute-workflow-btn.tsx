import useExecutionPlan from "@/hooks/use-execution-plan";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { onlineManager, useMutation } from "@tanstack/react-query";
import { executeWorkflowAction } from "@/lib/server/actions/workflows/execute-workflow-action";
import { toast } from "sonner";
import { useEdges, useNodes } from "@xyflow/react";
import { useRouter } from "next/navigation";

export default function ExecuteWorkflowBtn({
  workflowId,
}: {
  workflowId: string;
}) {
  const router = useRouter();
  const generateWorkflowPlan = useExecutionPlan();

  const nodes = useNodes();
  const edges = useEdges();
  const flowDefinition = JSON.stringify({ nodes, edges });
  const mutation = useMutation({
    mutationFn: executeWorkflowAction,
    retry: (failureCount) => failureCount < 2,
    networkMode: "always",
    onSuccess: (executionId) => {
      toast.success("Execution is Running", { id: "flow-execution" });
      router.replace(`/dashboard/workflow/runs/${workflowId}/${executionId}`);
    },
    onError: (error) => {
      toast.error(error.message, { id: "flow-execution" });
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
                id: "flow-execution",
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
              id: "flow-execution",
            }
          );
          return;
        }
        toast.loading("Executing Workflow...", { id: "flow-execution" });
        mutation.mutate({
          workflowId,
          flowDefinition: flowDefinition,
        });
        console.log("---plan --");
        console.table({ executionPlan });
      }}
    >
      <PlayCircle className="text-primary" />
      {mutation.isPending ? "executing..." : "execute"}
    </Button>
  );
}
