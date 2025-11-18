
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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const subjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  type: z.enum(["Core", "Elective"]),
  classes: z.string().min(1, "Assigned classes are required"),
});

type Subject = z.infer<typeof subjectSchema>;

const initialSubjects: Subject[] = [
    { id: '1', name: "Mathematics", code: "MATH101", type: "Core", classes: "Class 9, Class 10" },
    { id: '2', name: "Physics", code: "PHY101", type: "Core", classes: "Class 10" },
    { id: '3', name: "Computer Science", code: "CS101", type: "Elective", classes: "Class 9, Class 10" },
];

export function SubjectsClient() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<Subject>({
    resolver: zodResolver(subjectSchema),
  });

  const handleOpenDialog = (subject: Subject | null = null) => {
    setEditingSubject(subject);
    if (subject) {
      setValue("name", subject.name);
      setValue("code", subject.code);
      setValue("type", subject.type);
      setValue("classes", subject.classes);
    } else {
      reset({ name: "", code: "", type: "Core", classes: "" });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<Subject> = (data) => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, ...data } : s));
    } else {
      setSubjects([...subjects, { ...data, id: (subjects.length + 1).toString() }]);
    }
    setIsDialogOpen(false);
    reset();
  };

  return (
    <Card className="glassmorphic mt-4">
      <CardHeader>
         <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>
                You can manage subjects offered across different classes.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Subject
            </Button>
          </div>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Subject Code</TableHead>
                <TableHead>Type</TableHead>
                 <TableHead>Assigned Classes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map(subject => (
                <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.code}</TableCell>
                    <TableCell>{subject.type}</TableCell>
                    <TableCell>{subject.classes}</TableCell>
                    <TableCell className="text-right">
                       <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleOpenDialog(subject)}>
                            Edit
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit {subject.name}</p>
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
            <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
            <DialogDescription>
              {editingSubject ? "Update the details for the subject." : "Enter details for the new subject."}
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
                <Label htmlFor="code" className="text-right">Code</Label>
                <Input id="code" {...register("code")} className="col-span-3" />
                {errors.code && <p className="col-span-4 text-destructive text-xs text-right">{errors.code.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Core">Core</SelectItem>
                            <SelectItem value="Elective">Elective</SelectItem>
                        </SelectContent>
                    </Select>
                    )}
                />
                {errors.type && <p className="col-span-4 text-destructive text-xs text-right">{errors.type.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classes" className="text-right">Classes</Label>
                <Input id="classes" {...register("classes")} className="col-span-3" placeholder="e.g., Class 9, Class 10"/>
                {errors.classes && <p className="col-span-4 text-destructive text-xs text-right">{errors.classes.message}</p>}
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
