
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DashboardFilterProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function DashboardFilter({ value, onValueChange }: DashboardFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="this-week">This Week</SelectItem>
        <SelectItem value="this-month">This Month</SelectItem>
        <SelectItem value="this-quarter">This Quarter</SelectItem>
        <SelectItem value="this-year">This Year</SelectItem>
      </SelectContent>
    </Select>
  );
}
