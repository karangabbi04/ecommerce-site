import React from 'react'
import { Select, SelectContent,SelectItem,SelectTrigger,  SelectValue,} from '@/components/ui/select';





interface AnalyticsSelectProps {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
      placeholder?: string;

}


export type SelectOption = {
    label: string;
    value: string;
};

interface Props {}

function AnalyticsSelect({
  value,
  options,
  onChange,
    placeholder = "Select...",
}: AnalyticsSelectProps) {
    return (
        <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AnalyticsSelect
