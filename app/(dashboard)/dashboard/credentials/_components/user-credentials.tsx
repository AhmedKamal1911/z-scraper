import { Card } from "@/components/ui/card";
import { getCredentialsForUser } from "@/lib/server/queries/credentials/get-credentials-for-user";
import { KeyRound } from "lucide-react";
import CreateCredentialDialog from "./create-credential-dialog";
import { CredentialCard } from "./credential-card";

export async function UserCredentials() {
  const credentials = await getCredentialsForUser();
  if (credentials.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3  text-center flex-1">
        <div className="rounded-full bg-muted p-3">
          <KeyRound className="size-6 text-primary" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold">No credentials yet</h3>
          <p className="text-sm text-muted-foreground">
            You haven’t added any credentials yet. Create one to get started.
          </p>
        </div>

        <CreateCredentialDialog buttonText="create your first credential" />
      </Card>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {credentials.map((credential) => (
        <CredentialCard key={credential.id} credentialInfo={credential} />
      ))}
    </div>
  );
}
