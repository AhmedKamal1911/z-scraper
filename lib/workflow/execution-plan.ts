import { Edge } from "@xyflow/react";
import { WorkflowExecutionPlan as WorkflowExecutionPlanPhase } from "../types/workflow";
import { FlowNode, FlowNodeMissingInputs } from "../types/flowNode";
import { TaskRegistry } from "./task/task-registry";

export enum FlowValidationInputsError {
  "NO_STARTING_POINT",
  "INVALID_INPUTS",
}
export type ErrorValidationInputs = {
  type: FlowValidationInputsError;
  invalidElements?: FlowNodeMissingInputs[];
};
type FlowToExecutionPlanType = {
  executionPlan: WorkflowExecutionPlanPhase[] | null;
  error: ErrorValidationInputs | null;
};
export function flowToExecutionPlan(
  nodes: FlowNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const invalidInputsErrors: FlowNodeMissingInputs[] = [];

  const startedEntryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );
  if (!startedEntryPoint) {
    return {
      executionPlan: null,
      error: {
        type: FlowValidationInputsError.NO_STARTING_POINT,
      },
    };
  }
  const executionPlan: WorkflowExecutionPlanPhase[] = [
    {
      phaseNumber: 1,
      nodes: [startedEntryPoint],
    },
  ];
  // REMEMBER: To ask when to stop the loop >> sure if all the nodes have been added to execution plan
  const planned = new Set<string>();
  const invalidInputs = getInvalidInputs({
    node: startedEntryPoint,
    edges,
    planned,
  });

  if (invalidInputs.length > 0) {
    invalidInputsErrors.push({
      nodeId: startedEntryPoint.id,
      inputs: invalidInputs,
    });
  }

  planned.add(startedEntryPoint.id);
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = {
      phaseNumber: phase,
      nodes: [],
    };
    // We will looping on every node to decide if we should push it in this phase or not
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Node already in the execution plan
        continue;
      }

      const invalidInputs = getInvalidInputs({
        node: currentNode,
        edges,
        planned,
      });

      if (invalidInputs.length > 0) {
        // we need to check all dependancies to see if it planned or not because the node inputs will be invalid if the dependancy nodes are also invalid
        const incomers = getIncomers({ node: currentNode, nodes, edges });
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // here we are checking if any if all these incomers are planned and there are their inputs still invalid
          // it means that this specific node has an invalid input which means the workflow is invalid

          invalidInputsErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
    }
    // adding the nodes which isn't invalid to the planned storage in nextphase
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }

    executionPlan.push(nextPhase);
  }
  if (invalidInputsErrors.length > 0) {
    return {
      executionPlan: null,
      error: {
        type: FlowValidationInputsError.INVALID_INPUTS,
        invalidElements: invalidInputsErrors,
      },
    };
  }
  return { executionPlan, error: null };
}

function getInvalidInputs({
  edges,
  node,
  planned,
}: {
  node: FlowNode;
  edges: Edge[];
  planned: Set<string>;
}) {
  const invalidInputs: string[] = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const hasValue = inputValue && inputValue.length > 0;

    // If the input already has a value, it's valid, skip it
    if (hasValue) continue;

    // Get all edges coming into this node
    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    // Find the edge connected specifically to this input
    const linkedEdge = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    // If the input is required
    if (input.required) {
      // If there is a connected edge and its source node is already planned, input is valid
      if (linkedEdge && planned.has(linkedEdge.source)) continue;

      // Otherwise, the required input is missing or invalid
      invalidInputs.push(input.name);
      continue;
    }

    // If the input is optional
    if (linkedEdge && planned.has(linkedEdge.source)) {
      // Optional input is connected and source is planned, so it's valid
      continue;
    }

    // If optional input is neither connected nor has value, consider it invalid for current execution
    invalidInputs.push(input.name);
  }

  return invalidInputs;
}

function getIncomers({
  node,
  nodes,
  edges,
}: {
  node: FlowNode;
  nodes: FlowNode[];
  edges: Edge[];
}) {
  if (!node.id) {
    return [];
  }
  const incomersIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });
  return nodes.filter((nd) => incomersIds.has(nd.id));
}
