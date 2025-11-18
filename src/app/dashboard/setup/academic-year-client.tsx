
'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

const academicYearSchema = z.object({
  id: z.string().optional(),
  year: z.string().min(1, "Year is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["Active", "Completed", "Upcoming"]),
});

type AcademicYear = z.infer<typeof academicYearSchema>;

const initialAcademicYears: AcademicYear[] = [
  { id: '1', year: "2024-2025", startDate: "2024-04-01", endDate: "2025-03-31", status: "Active" },
  { id: '2', year: "2023-2024", startDate: "2023-04-01", endDate: "2024-03-31", status: "Completed" },
];

export function AcademicYearClient() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(initialAcademicYears);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AcademicYear>({
    resolver: zodResolver(academicYearSchema),
  });

  const handleOpenDialog = (year: AcademicYear | null = null) => {
    setEditingYear(year);
    if (year) {
      setValue("year", year.year);
      setValue("startDate", year.startDate);
      setValue("endDate", year.endDate);
      setValue("status", year.status);
    } else {
      reset({ year: "", startDate: "", endDate: "", status: "Upcoming" });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<AcademicYear> = (data) => {
    if (editingYear) {
      setAcademicYears(academicYears.map(y => y.id === editingYear.id ? { ...y, ...data } : y));
    } else {
      setAcademicYears([...academicYears, { ...data, id: (academicYears.length + 1).toString() }]);
    }
    setIsDialogOpen(false);
    reset();
  };

  const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), "dd MMM yyyy");
    } catch {
        return "Invalid Date";
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length === 4 && /^\d{4}$/.test(value)) {
      value += '-';
    }
    // Limit the length to prevent more than YYYY-YYYY
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    setValue('year', value);
  };


  return (
    <Card className="glassmorphic mt-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Academic Years</CardTitle>
            <CardDescription>
              Manage academic sessions for your school.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Year
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {academicYears.map(year => (
              <TableRow key={year.id}>
                <TableCell className="font-medium">{year.year}</TableCell>
                <TableCell>{formatDate(year.startDate)}</TableCell>
                <TableCell>{formatDate(year.endDate)}</TableCell>
                <TableCell>
                  <Badge variant={year.status === 'Active' ? 'default' : 'secondary'}>{year.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(year)} disabled={year.status === 'Completed'}>
                        Edit
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{year.status === 'Completed' ? 'Cannot edit a completed year' : 'Edit Academic Year'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingYear ? "Edit Academic Year" : "Add New Academic Year"}</DialogTitle>
            <DialogDescription>
              {editingYear ? "Update the details for the academic year." : "Enter details for the new academic year."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">Year</Label>
                <Input
                  id="year"
                  {...register("year", {
                    onChange: handleYearChange,
                  })}
                  className="col-span-3"
                  placeholder="e.g., 2025-2026"
                  maxLength={9}
                />
                {errors.year && <p className="col-span-4 text-destructive text-xs text-right">{errors.year.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} className="col-span-3" />
                 {errors.startDate && <p className="col-span-4 text-destructive text-xs text-right">{errors.startDate.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} className="col-span-3" />
                 {errors.endDate && <p className="col-span-4 text-destructive text-xs text-right">{errors.endDate.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
