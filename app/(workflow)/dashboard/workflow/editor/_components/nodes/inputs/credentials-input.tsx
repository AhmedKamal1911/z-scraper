import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCredentialsForUser } from "@/lib/server/queries/credentials/get-credentials-for-user";
import { StringInputFieldProps } from "@/lib/types/nodeTask";
import { useQuery } from "@tanstack/react-query";
import { useId } from "react";
export default function CredentialsInput({
  inputProps,
  inputValue,
  updateNodeInputValue,
}: StringInputFieldProps) {
  const query = useQuery({
    queryKey: ["user-credentials"],
    queryFn: () => getCredentialsForUser(),
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  const id = useId();
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs w-fit">
        {inputProps.name}

        {inputProps.required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeInputValue(value)}
        defaultValue={inputValue}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="font-bold">Credentials</SelectLabel>
            {query.data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
