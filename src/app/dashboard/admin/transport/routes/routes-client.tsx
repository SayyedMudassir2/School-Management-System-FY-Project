'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, IndianRupee } from 'lucide-react';
import { useForm, SubmitHandler, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { type TransportRoute, type Vehicle, type TeacherProfile as Driver } from '@/lib/mock-data';

const stopSchema = z.object({
  name: z.string().min(1, 'Stop name is required'),
  landmark: z.string().optional(),
  time: z.string().min(1, 'Time is required'),
  distance: z.string().optional(),
  coordinates: z.string().optional(),
});

const routeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Route name is required'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  dropTime: z.string().min(1, 'Drop time is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().min(1, 'Driver is required'),
  fare: z.preprocess((val) => Number(val), z.number().min(0, 'Fare must be positive')),
  stops: z.array(stopSchema).min(1, 'At least one stop is required'),
});

type RouteFormValues = z.infer<typeof routeSchema>;

type RoutesClientProps = {
  initialRoutes: TransportRoute[];
  allVehicles: Vehicle[];
  allDrivers: Driver[];
};

export function RoutesClient({ initialRoutes, allVehicles, allDrivers }: RoutesClientProps) {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<TransportRoute[]>(initialRoutes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
        stops: [{ name: '', time: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stops",
  });

  const vehicleMap = useMemo(() => new Map(allVehicles.map(v => [v.id, v.number])), [allVehicles]);
  const driverMap = useMemo(() => new Map(allDrivers.map(d => [d.id, d.name])), [allDrivers]);

  const filteredRoutes = useMemo(() => {
    return routes.filter(route => 
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicleMap.get(route.vehicleId) || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [routes, searchTerm, vehicleMap]);

  const handleOpenDialog = (route: TransportRoute | null = null) => {
    setEditingRoute(route);
    if (route) {
      reset(route);
    } else {
      reset({
        name: '',
        pickupTime: '',
        dropTime: '',
        vehicleId: '',
        driverId: '',
        fare: 0,
        stops: [{ name: '', time: '' }],
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<RouteFormValues> = (data) => {
    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...r, ...data } : r));
      toast({ title: 'Success', description: 'Route updated.' });
    } else {
      setRoutes([{ ...data, id: `R${Date.now()}` }, ...routes]);
      toast({ title: 'Success', description: 'New route added.' });
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (routeId: string) => {
    setRoutes(routes.filter(r => r.id !== routeId));
    toast({ variant: 'destructive', title: 'Deleted', description: 'Route has been removed.' });
  }

  return (
    <>
      <Card className="glassmorphic">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Routes</CardTitle>
              <CardDescription>A list of all transportation routes.</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Route
            </Button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by route name or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Total Stops</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{route.stops.length}</TableCell>
                    <TableCell>{vehicleMap.get(route.vehicleId) || 'N/A'}</TableCell>
                    <TableCell>{driverMap.get(route.driverId) || 'N/A'}</TableCell>
                    <TableCell className="flex items-center"><IndianRupee className="h-3 w-3 mr-1" />{route.fare.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(route)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(route.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
            <DialogDescription>Enter the details for the transport route.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
              <Input {...register('name')} placeholder="Route Name (e.g., Sector-56 to School)" />
              {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
              <div className="grid grid-cols-2 gap-4">
                <Input {...register('pickupTime')} placeholder="Pickup Time (e.g., 07:00 AM)" />
                <Input {...register('dropTime')} placeholder="Drop Time (e.g., 03:00 PM)" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Controller name="vehicleId" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Assign Vehicle"/></SelectTrigger>
                        <SelectContent>{allVehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.number}</SelectItem>)}</SelectContent>
                    </Select>
                )}/>
                <Controller name="driverId" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Assign Driver"/></SelectTrigger>
                        <SelectContent>{allDrivers.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                )}/>
                 <Input {...register('fare')} type="number" placeholder="Fare (e.g., 1500)" />
              </div>
              
              <Card>
                <CardHeader><CardTitle>Stops</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                        <Input {...register(`stops.${index}.name`)} placeholder="Stop Name" />
                        <Input {...register(`stops.${index}.time`)} type="time" placeholder="Time at Stop" />
                        <div className="flex items-center gap-2">
                           <Input {...register(`stops.${index}.landmark`)} placeholder="Landmark" />
                           <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => append({ name: '', time: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Stop
                  </Button>
                </CardContent>
              </Card>

            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Route</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
