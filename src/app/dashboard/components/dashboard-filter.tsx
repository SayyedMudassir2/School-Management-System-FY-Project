
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DashboardFilter() {
  return (
    <Select defaultValue="this-week">
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
