import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PageHeader from "../_components/common/page-header";
import { ShieldPlus } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import CreateCredentialDialog from "./_components/create-credential-dialog";

import { UserCredentials } from "./_components/user-credentials";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Credentials",
  description:
    "Manage and secure your credentials with encrypted storage and controlled access.",
};
export default async function CredentialsPage() {
  return (
    <div className="flex flex-col h-full gap-6">
      <PageHeader
        title="Credentials"
        description="Manage your credentials."
        action={<CreateCredentialDialog buttonText="create" />}
      />

      <div className="h-full flex flex-col gap-16">
        <Alert>
          <ShieldPlus className="size-6 stroke-primary" />
          <AlertTitle className="text-primary font-bold">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring tour data remains
            safe
          </AlertDescription>
        </Alert>
        <Suspense fallback={<CredentialsSkeleton />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
}

function CredentialsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5">
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="h-[74px]" />
      ))}
    </div>
  );
}
