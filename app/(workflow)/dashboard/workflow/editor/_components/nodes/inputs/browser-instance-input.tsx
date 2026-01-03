import { StringInputFieldProps } from "@/lib/types/nodeTask";

export default function BrowserInstanceInput({
  inputProps,
}: StringInputFieldProps) {
  return <div>{inputProps.name}</div>;
}
