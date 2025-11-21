
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const periodSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
});

const daySchema = z.object({
  periods: z.array(periodSchema).length(8, "Each day must have 8 periods"),
});

const timetableSchema = z.object({
  id: z.string().optional(),
  className: z.string().min(1, "Class name is required"),
  schedule: z.object({
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
  }),
});

type Timetable = z.infer<typeof timetableSchema>;

const initialTimetables: Timetable[] = [];

const availableClasses = ["Class 10-A", "Class 9-A", "Class 8-B"];
const availableSubjects = ["Mathematics", "Physics", "Computer Science", "English", "History", "Biology", "Chemistry", "Art"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

export function TimetableClient() {
  const [timetables, setTimetables] = useState<Timetable[]>(initialTimetables);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);

  const { register, handleSubmit, reset, setValue, control, watch, formState: { errors } } = useForm<Timetable>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      schedule: {
        Monday: { periods: Array(8).fill({ subject: "" }) },
        Tuesday: { periods: Array(8).fill({ subject: "" }) },
        Wednesday: { periods: Array(8).fill({ subject: "" }) },
        Thursday: { periods: Array(8).fill({ subject: "" }) },
        Friday: { periods: Array(8).fill({ subject: "" }) },
      }
    }
  });

  const handleOpenDialog = (timetable: Timetable | null = null) => {
    setEditingTimetable(timetable);
    if (timetable) {
      reset(timetable);
    } else {
      reset({
        className: "",
        schedule: {
          Monday: { periods: Array(8).fill({ subject: "" }) },
          Tuesday: { periods: Array(8).fill({ subject: "" }) },
          Wednesday: { periods: Array(8).fill({ subject: "" }) },
          Thursday: { periods: Array(8).fill({ subject: "" }) },
          Friday: { periods: Array(8).fill({ subject: "" }) },
        }
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<Timetable> = (data) => {
    if (editingTimetable) {
      setTimetables(timetables.map(t => t.id === editingTimetable.id ? { ...t, ...data } : t));
    } else {
      setTimetables([...timetables, { ...data, id: (timetables.length + 1).toString() }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <Card className="glassmorphic mt-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Class Timetables</CardTitle>
            <CardDescription>You can create and manage class schedules.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Timetable
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {timetables.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No timetables created yet.</p>
        ) : (
          <div className="space-y-4">
            {timetables.map(timetable => (
              <div key={timetable.id}>
                <h3 className="text-lg font-semibold mb-2">{timetable.className}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      {[...Array(8)].map((_, i) => <TableHead key={i}>Period {i + 1}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {daysOfWeek.map(day => (
                      <TableRow key={day}>
                        <TableCell className="font-medium">{day}</TableCell>
                        {timetable.schedule[day].periods.map((period, i) => <TableCell key={i}>{period.subject}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingTimetable ? "Edit Timetable" : "Create New Timetable"}</DialogTitle>
            <DialogDescription>
              {editingTimetable ? "Update the class schedule." : "Set up a new class schedule for the week."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="className" className="text-right">Class</Label>
                <div className="col-span-3">
                  <Controller
                    control={control}
                    name="className"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                        <SelectContent>
                          {availableClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.className && <p className="text-destructive text-xs mt-1">{errors.className.message}</p>}
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Day</TableHead>
                      {[...Array(8)].map((_, i) => <TableHead key={i} className="min-w-[150px]">Period {i + 1}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {daysOfWeek.map(day => (
                      <TableRow key={day}>
                        <TableCell className="font-medium">{day}</TableCell>
                        {[...Array(8)].map((_, periodIndex) => (
                          <TableCell key={periodIndex}>
                            <Controller
                              control={control}
                              name={`schedule.${day}.periods.${periodIndex}.subject`}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
                                  <SelectContent>
                                    {availableSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                             {errors?.schedule?.[day]?.periods?.[periodIndex]?.subject && <p className="text-destructive text-xs mt-1">Required</p>}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
