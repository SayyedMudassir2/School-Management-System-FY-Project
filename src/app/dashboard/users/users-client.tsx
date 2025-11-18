
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
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Administrator", "Parent", "Student", "Teacher"]),
  status: z.enum(["Active", "Inactive"]),
});

type User = z.infer<typeof userSchema>;

const initialUsers: User[] = [
  { id: '1', name: "Alex Doe", email: "alex.doe@example.com", role: "Administrator", status: "Active" },
  { id: '2', name: "Jane Doe", email: "jane.doe@example.com", role: "Parent", status: "Active" },
  { id: '3', name: "John Doe", email: "john.doe@example.com", role: "Student", status: "Inactive" },
  { id: '4', name: "Mr. John Smith", email: "john.smith@example.com", role: "Teacher", status: "Active" },
];

export function UsersClient() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const handleOpenDialog = (user: User | null = null) => {
    setEditingUser(user);
    if (user) {
      reset(user);
    } else {
      reset({ name: "", email: "", role: "Student", status: "Active" });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<User> = (data) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
    } else {
      setUsers([...users, { ...data, id: (users.length + 1).toString() }]);
    }
    setIsDialogOpen(false);
    reset();
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
        setUsers(users.filter(user => user.id !== userToDelete.id));
        setUserToDelete(null);
    }
  }

  return (
    <TooltipProvider>
        <Card className="glassmorphic mt-4">
        <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                A list of all users in the system.
                </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New User
            </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => (
                <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className={user.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-500/20' : ''}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(user)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit User</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit {user.name}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setUserToDelete(user)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete User</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete {user.name}</p>
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
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription>
                {editingUser ? "Update the details for the user." : "Enter details for the new user."}
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
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" type="email" {...register("email")} className="col-span-3" />
                    {errors.email && <p className="col-span-4 text-destructive text-xs text-right">{errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">Role</Label>
                    <Controller
                        control={control}
                        name="role"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Administrator">Administrator</SelectItem>
                                <SelectItem value="Parent">Parent</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Teacher">Teacher</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.role && <p className="col-span-4 text-destructive text-xs text-right">{errors.role.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                     {errors.status && <p className="col-span-4 text-destructive text-xs text-right">{errors.status.message}</p>}
                </div>
                </div>
                <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save changes</Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>

        <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user account for <span className="font-semibold">{userToDelete?.name}</span> and remove their data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        </Card>
    </TooltipProvider>
  );
}
