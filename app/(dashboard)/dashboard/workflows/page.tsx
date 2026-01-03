import { Suspense } from "react";
import PageHeader from "../_components/common/page-header";

import UserWorkflowsSkeleton from "./_components/user-workflows-skeleton";
import UserWorkflows from "./_components/user-workflows";
import CreateWorkflowDialog from "./_components/dialogs/create-workflow-dialog";

export default function WorkFlowsPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Workflows"
        description="Manage your workflows."
        action={<CreateWorkflowDialog />}
      />
      <div className="relative flex-1 py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}
