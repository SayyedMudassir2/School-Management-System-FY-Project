
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Expense } from '@/lib/mock-data';

const expenseSchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  amount: z.preprocess((val) => Number(val), z.number().min(1, 'Amount must be greater than 0')),
  category: z.enum(['Salary', 'Utilities', 'Maintenance', 'Stationery', 'Transport', 'Miscellaneous']),
  payee: z.string().min(1, 'Payee is required'),
  paymentMode: z.enum(['Cash', 'Cheque', 'Bank Transfer']),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

type ExpensesClientProps = {
  initialExpenses: Expense[];
};

export function ExpensesClient({ initialExpenses }: ExpensesClientProps) {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<ExpenseFormValues>();

  const handleOpenDialog = (expense: Expense | null = null) => {
    setEditingExpense(expense);
    if (expense) {
      reset({
        ...expense,
        date: format(new Date(expense.date), 'yyyy-MM-dd')
      });
    } else {
      reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: 0,
        category: 'Miscellaneous',
        payee: '',
        paymentMode: 'Cash',
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<ExpenseFormValues> = (data) => {
    if (editingExpense) {
      setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...e, ...data } : e));
      toast({ title: "Success", description: "Expense updated." });
    } else {
      setExpenses([{ ...data, id: `EXP${Date.now()}` }, ...expenses]);
      toast({ title: "Success", description: "New expense added." });
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (expenseId: string) => {
    setExpenses(expenses.filter(e => e.id !== expenseId));
    toast({ variant: 'destructive', title: 'Deleted', description: 'Expense record has been removed.' });
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
      const matchesSearch = searchTerm === '' ||
        e.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [expenses, searchTerm, categoryFilter]);
  
  const totalExpensesThisMonth = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return filteredExpenses
        .filter(e => new Date(e.date) >= start && new Date(e.date) <= end)
        .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpensesThisMonth.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glassmorphic">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Expense List</CardTitle>
              <CardDescription>A log of all school expenditures.</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Expense
            </Button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by payee or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {['Salary', 'Utilities', 'Maintenance', 'Stationery', 'Transport', 'Miscellaneous'].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(new Date(expense.date), 'dd MMM, yyyy')}</TableCell>
                      <TableCell className="font-medium">{expense.payee}</TableCell>
                      <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                      <TableCell>{expense.paymentMode}</TableCell>
                      <TableCell className="text-right font-semibold">${expense.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenDialog(expense)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(expense.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">No expenses found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
            <DialogDescription>Enter the details for the expenditure.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-destructive text-xs mt-1">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" {...register('amount')} placeholder="e.g., 5000" />
                {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="payee">Payee</Label>
                <Input id="payee" {...register('payee')} placeholder="e.g., City Electric Board" />
                {errors.payee && <p className="text-destructive text-xs mt-1">{errors.payee.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        {['Salary', 'Utilities', 'Maintenance', 'Stationery', 'Transport', 'Miscellaneous'].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <Controller
                  control={control}
                  name="paymentMode"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="paymentMode"><SelectValue placeholder="Select a mode" /></SelectTrigger>
                      <SelectContent>
                        {['Cash', 'Cheque', 'Bank Transfer'].map(mode => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Expense</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
