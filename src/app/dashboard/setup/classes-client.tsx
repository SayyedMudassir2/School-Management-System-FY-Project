
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
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const classSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Class name is required"),
  sections: z.string().min(1, "Sections are required"),
  teacher: z.string().min(1, "Class teacher is required"),
  studentCount: z.preprocess((val) => Number(val), z.number().min(0, "Student count must be positive")),
});

type Class = z.infer<typeof classSchema>;

const initialClasses: Class[] = [
  { id: '1', name: "Class 10", sections: "A, B, C", teacher: "Mr. John Smith", studentCount: 120 },
  { id: '2', name: "Class 9", sections: "A, B", teacher: "Ms. Emily White", studentCount: 85 },
];

export function ClassesClient() {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Class>({
    resolver: zodResolver(classSchema),
  });

  const handleOpenDialog = (classItem: Class | null = null) => {
    setEditingClass(classItem);
    if (classItem) {
      setValue("name", classItem.name);
      setValue("sections", classItem.sections);
      setValue("teacher", classItem.teacher);
      setValue("studentCount", classItem.studentCount);
    } else {
      reset({ name: "", sections: "", teacher: "", studentCount: 0 });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<Class> = (data) => {
    if (editingClass) {
      setClasses(classes.map(c => c.id === editingClass.id ? { ...c, ...data } : c));
    } else {
      setClasses([...classes, { ...data, id: (classes.length + 1).toString() }]);
    }
    setIsDialogOpen(false);
    reset();
  };

  return (
    <Card className="glassmorphic mt-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Classes & Sections</CardTitle>
            <CardDescription>
              You can manage all classes and their respective sections.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Class
          </Button>
        </div>
      </CardHeader>
      <CardContent>
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Class Teacher</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map(classItem => (
                <TableRow key={classItem.id}>
                    <TableCell className="font-medium">{classItem.name}</TableCell>
                    <TableCell>{classItem.sections}</TableCell>
                    <TableCell>{classItem.teacher}</TableCell>
                    <TableCell>{classItem.studentCount}</TableCell>
                    <TableCell className="text-right">
                       <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="outline" size="sm" onClick={() => handleOpenDialog(classItem)}>
                            Manage
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Manage {classItem.name}</p>
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
            <DialogTitle>{editingClass ? "Edit Class" : "Add New Class"}</DialogTitle>
            <DialogDescription>
              {editingClass ? "Update the details for the class." : "Enter details for the new class."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" {...register("name")} className="col-span-3" />
                {errors.name && <p className="col-span-4 text-destructive text-xs text-right">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sections" className="text-right">Sections</Label>
                <Input id="sections" {...register("sections")} className="col-span-3" placeholder="e.g., A, B, C"/>
                {errors.sections && <p className="col-span-4 text-destructive text-xs text-right">{errors.sections.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">Teacher</Label>
                <Input id="teacher" {...register("teacher")} className="col-span-3" />
                 {errors.teacher && <p className="col-span-4 text-destructive text-xs text-right">{errors.teacher.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studentCount" className="text-right">Students</Label>
                <Input id="studentCount" type="number" {...register("studentCount")} className="col-span-3" />
                 {errors.studentCount && <p className="col-span-4 text-destructive text-xs text-right">{errors.studentCount.message}</p>}
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
