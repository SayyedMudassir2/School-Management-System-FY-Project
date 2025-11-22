
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from '@/hooks/use-toast';
import { classes, type FeeStructure } from '@/lib/mock-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const feeStructureSchema = z.object({
    id: z.string().optional(),
    classId: z.string(),
    academicYear: z.string(),
    feeHead: z.string().min(1, 'Fee head is required'),
    category: z.string().min(1, 'Category is required'),
    amount: z.preprocess((val) => Number(val), z.number().min(1, 'Amount must be greater than 0')),
});

type FeeStructureForm = z.infer<typeof feeStructureSchema>;

const academicYears = ["2024-2025", "2023-2024"];
const feeCategories = ["Academic", "Transport", "Hostel", "Lab", "Miscellaneous"];

export function FeeStructureClient({ initialFeeStructures }: { initialFeeStructures: FeeStructure[] }) {
  const { toast } = useToast();
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(initialFeeStructures);
  const [selectedYear, setSelectedYear] = useState<string>(academicYears[0]);
  const [selectedClass, setSelectedClass] = useState<string>(classes[0].id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<FeeStructureForm>();

  const classMap = useMemo(() => new Map(classes.map(c => [c.id, c.name])), []);

  const filteredFeeStructures = useMemo(() => {
    return feeStructures.filter(fs => fs.academicYear === selectedYear && fs.classId === selectedClass);
  }, [feeStructures, selectedYear, selectedClass]);
  
  const handleOpenDialog = (fee: FeeStructure | null = null) => {
    setEditingFee(fee);
    if (fee) {
      reset(fee);
    } else {
      reset({
        academicYear: selectedYear,
        classId: selectedClass,
        feeHead: '',
        category: '',
        amount: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<FeeStructureForm> = (data) => {
    const finalData = { ...data, academicYear: selectedYear, classId: selectedClass };

    if (editingFee) {
      setFeeStructures(feeStructures.map(fs => fs.id === editingFee.id ? { ...fs, ...finalData } : fs));
      toast({ title: "Success", description: "Fee structure updated." });
    } else {
      setFeeStructures([...feeStructures, { ...finalData, id: `FS${Date.now()}` }]);
      toast({ title: "Success", description: "New fee head added." });
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (feeId: string) => {
    setFeeStructures(feeStructures.filter(fs => fs.id !== feeId));
    toast({ variant: 'destructive', title: 'Deleted', description: 'Fee head has been removed.' });
  }

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Fee Structure Management</CardTitle>
        <CardDescription>
          Define and manage class-wise fee heads for each academic session.
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="flex-1 space-y-2">
            <Label>Academic Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{academicYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
           <div className="flex-1 space-y-2">
             <Label>Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Fee Head
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Head</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeeStructures.length > 0 ? (
                filteredFeeStructures.map((fs) => (
                  <TableRow key={fs.id}>
                    <TableCell className="font-medium">{fs.feeHead}</TableCell>
                    <TableCell>{fs.category}</TableCell>
                    <TableCell className="text-right">${fs.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(fs)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(fs.id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No fee structure defined for {classMap.get(selectedClass)} for {selectedYear}.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingFee ? "Edit Fee Head" : "Add New Fee Head"}</DialogTitle>
            <DialogDescription>
              Enter the details for the fee component.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        {feeCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeHead">Fee Head Name</Label>
                <Input id="feeHead" {...register("feeHead")} placeholder="e.g., Tuition Fee, Annual Fee" />
                {errors.feeHead && <p className="text-destructive text-xs mt-1">{errors.feeHead.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" {...register("amount")} placeholder="e.g., 5000" />
                {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Fee Head</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
