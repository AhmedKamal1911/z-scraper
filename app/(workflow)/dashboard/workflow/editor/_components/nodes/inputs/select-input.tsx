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
import { StringInputFieldProps } from "@/lib/types/nodeTask";
import { useId } from "react";
export default function SelectInput({
  inputProps,
  inputValue,
  updateNodeInputValue,
}: StringInputFieldProps) {
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
        <SelectTrigger className="w-full bg-background!">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="font-bold">Options</SelectLabel>
            {inputProps?.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
