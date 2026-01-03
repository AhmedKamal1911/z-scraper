"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  IsValidConnection,
  OnBeforeDelete,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { DragEvent, useCallback, useMemo } from "react";
import { CustomNodeComponent } from "./nodes/custom-node-component";
import { FlowNode } from "@/lib/types/flowNode";
import { WorkflowDefinition } from "@/lib/types/workflow";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createFlowNode } from "@/lib/workflow/create-flow-node";
import { NodeTaskType } from "@/lib/types/nodeTask";
import DeletableEdge from "./deletable-edge";
import { toast } from "sonner";
import { TaskRegistry } from "@/lib/workflow/task/task-registry";
import { Workflow } from "@prisma/client";
const nodeTypes = {
  ZScraperNode: CustomNodeComponent,
};
const edgeTypes = {
  default: DeletableEdge,
};
const fitViewOptions = { padding: 0.2 };
export default function FlowEditor({ workflow }: { workflow: Workflow }) {
  const { screenToFlowPosition, updateNodeData } = useReactFlow();
  const workflowParsed = useMemo(() => {
    const definition: WorkflowDefinition = JSON.parse(workflow.definition);
    return definition;
  }, [workflow.definition]);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(
    workflowParsed.nodes ?? []
  );
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>(
    workflowParsed.edges ?? []
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const taskType = e.dataTransfer.getData(
        "application/nodesFlow"
      ) as NodeTaskType;
      if (typeof taskType === undefined || !taskType) return;
      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      const newTaskNode = createFlowNode(taskType, position);
      setNodes((nodes) => nodes.concat(newTaskNode));
    },
    [screenToFlowPosition, setNodes]
  );
  const onBeforeDelete: OnBeforeDelete<FlowNode, Edge> = useCallback(
    async ({ nodes: deletingNodes }) => {
      const hasLaunchBrowser = deletingNodes.some(
        (node) => node.data.type === "LAUNCH_BROWSER"
      );

      if (hasLaunchBrowser) {
        toast.warning("Lauch Browser Node Cannot Be Removed!");
        return false;
      }

      return true;
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      const node = nodes.find((n) => n.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;

      updateNodeData(node.id, {
        inputs: { ...nodeInputs, [connection.targetHandle]: "" },
      });
    },
    [nodes, setEdges, updateNodeData]
  );

  const isValidConnection: IsValidConnection<Edge> = useCallback(
    ({ source, target, sourceHandle, targetHandle }) => {
      // Turn off self-connection
      if (source === target) {
        return false;
      }
      const nodeSource = nodes.find((node) => node.id === source);
      const nodeTarget = nodes.find((node) => node.id === target);
      if (!nodeSource || !nodeTarget) {
        console.error("invalid source or target : notfound!");
        return false;
      }
      const taskSource = TaskRegistry[nodeSource.data.type];
      const taskTarget = TaskRegistry[nodeTarget.data.type];
      const output = taskSource.outputs.find(
        (out) => out.name === sourceHandle
      );
      const input = taskTarget.inputs.find((inp) => inp.name === targetHandle);

      if (input?.type !== output?.type) {
        console.error(
          "invalid connection : the input and the output aren't the same"
        );
        return false;
      }
      // prevent workflow cycle

      const hasCycle = (
        node: FlowNode,
        visited = new Set<string>()
      ): boolean => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }

        return false;
      };

      const detectedCycle = hasCycle(nodeTarget);
      return !detectedCycle;
    },
    [nodes, edges]
  );
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgeChange}
      onBeforeDelete={onBeforeDelete}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onConnect={onConnect}
      isValidConnection={isValidConnection}
      fitViewOptions={fitViewOptions}
      fitView
    >
      <Controls position="top-left" fitViewOptions={fitViewOptions} />
      <Background
        variant={BackgroundVariant.Lines}
        gap={12}
        size={1}
        color="var(--sidebar-accent)"
      />

      <SidebarTrigger
        variant={"default"}
        className="absolute top-31 left-3.5 opacity-100! hover:opacity-100! z-100 bg-primary/80 rounded-sm cursor-pointer"
        size={"icon"}
      />
    </ReactFlow>
  );
}
