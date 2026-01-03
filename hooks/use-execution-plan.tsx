import { useFlowValidation } from "@/components/context/FlowInputsValidationContext";
import { FlowNode } from "@/lib/types/flowNode";
import {
  ErrorValidationInputs,
  flowToExecutionPlan,
  FlowValidationInputsError,
} from "@/lib/workflow/execution-plan";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";

export default function useExecutionPlan() {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();
  const handleError = useCallback(
    (error: ErrorValidationInputs) => {
      switch (error.type) {
        case FlowValidationInputsError.NO_STARTING_POINT:
          toast.error("No entry point found!");

          break;
        case FlowValidationInputsError.INVALID_INPUTS:
          setInvalidInputs(error.invalidElements!);
          toast.error("Please fill all inputs values!");
          break;

        default:
          toast.error("Ops something went wrong!");
          break;
      }
    },
    [setInvalidInputs]
  );
  const generateExecuationPlan = useCallback(() => {
    clearErrors();
    const { nodes, edges } = toObject();
    const { executionPlan, error } = flowToExecutionPlan(
      nodes as FlowNode[],
      edges
    );
    if (error) {
      handleError(error);
      return { executionPlan: null, error };
    }

    return { executionPlan, error: null };
  }, [clearErrors, toObject, handleError]);
  return generateExecuationPlan;
}
