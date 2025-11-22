
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
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, Bus, AlertCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Vehicle, type TeacherProfile as Driver, type TransportRoute } from '@/lib/mock-data';
import { format, isBefore } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const vehicleSchema = z.object({
  id: z.string().optional(),
  number: z.string().min(1, 'Vehicle number is required'),
  type: z.enum(['Bus', 'Van', 'Car']),
  capacity: z.preprocess((val) => Number(val), z.number().min(1, 'Capacity must be at least 1')),
  driverId: z.string().optional(),
  insuranceDue: z.string().min(1, 'Insurance due date is required'),
  pucDue: z.string().min(1, 'PUC due date is required'),
  status: z.enum(['Active', 'In Service', 'Inactive']),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

type VehiclesClientProps = {
  initialVehicles: Vehicle[];
  allDrivers: Driver[];
  allRoutes: TransportRoute[];
};

export function VehiclesClient({ initialVehicles, allDrivers, allRoutes }: VehiclesClientProps) {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema)
  });

  const driverMap = useMemo(() => new Map(allDrivers.map(d => [d.id, d.name])), [allDrivers]);
  const routeMap = useMemo(() => new Map(allRoutes.map(r => [r.id, r.name])), [allRoutes]);
  const vehicleRouteMap = useMemo(() => new Map(allRoutes.map(r => [r.vehicleId, r.name])), [allRoutes]);

  const stats = useMemo(() => ({
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'Active').length,
    inService: vehicles.filter(v => v.status === 'In Service').length,
    insuranceAlerts: vehicles.filter(v => isBefore(new Date(v.insuranceDue), new Date(new Date().setDate(new Date().getDate() + 30)))).length,
  }), [vehicles]);

  const handleOpenDialog = (vehicle: Vehicle | null = null) => {
    setEditingVehicle(vehicle);
    if (vehicle) {
      reset({
        ...vehicle,
        insuranceDue: format(new Date(vehicle.insuranceDue), 'yyyy-MM-dd'),
        pucDue: format(new Date(vehicle.pucDue), 'yyyy-MM-dd'),
      });
    } else {
      reset({
        number: '',
        type: 'Bus',
        capacity: 40,
        status: 'Active',
        insuranceDue: '',
        pucDue: ''
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<VehicleFormValues> = (data) => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, ...data } : v));
      toast({ title: 'Success', description: 'Vehicle updated.' });
    } else {
      setVehicles([{ ...data, id: `V${Date.now()}` }, ...vehicles]);
      toast({ title: 'Success', description: 'New vehicle added.' });
    }
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: Vehicle['status']) => {
    switch(status) {
      case 'Active': return <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/20">Active</Badge>;
      case 'In Service': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/20">In Service</Badge>;
      case 'Inactive': return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/20">Inactive</Badge>;
    }
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="glassmorphic"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Vehicles</CardTitle><Bus className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
        <Card className="glassmorphic"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active on Route</CardTitle><ShieldCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.active}</div></CardContent></Card>
        <Card className="glassmorphic"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">In Service / Standby</CardTitle><ShieldCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.inService}</div></CardContent></Card>
        <Card className="glassmorphic"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Insurance Alerts</CardTitle><AlertCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{stats.insuranceAlerts}</div></CardContent></Card>
      </div>

      <Card className="glassmorphic">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Fleet List</CardTitle>
              <CardDescription>A list of all vehicles in the school's fleet.</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add New Vehicle</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader><TableRow><TableHead>Vehicle No</TableHead><TableHead>Type</TableHead><TableHead>Capacity</TableHead><TableHead>Driver</TableHead><TableHead>Current Route</TableHead><TableHead>Insurance Due</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.number}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.capacity}</TableCell>
                    <TableCell>{vehicle.driverId ? driverMap.get(vehicle.driverId) : 'N/A'}</TableCell>
                    <TableCell>{vehicle.id ? vehicleRouteMap.get(vehicle.id) : 'N/A'}</TableCell>
                    <TableCell className={isBefore(new Date(vehicle.insuranceDue), new Date()) ? 'text-destructive font-semibold' : ''}>
                      {format(new Date(vehicle.insuranceDue), 'dd MMM, yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(vehicle)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            <DialogDescription>Fill in the details of the vehicle.</DialogDescription>
          </DialogHeader>
           <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Vehicle Number</Label><Input {...register('number')} />{errors.number && <p className="text-destructive text-xs">{errors.number.message}</p>}</div>
                    <div className="space-y-2"><Label>Type</Label><Controller name="type" control={control} render={({field}) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Bus">Bus</SelectItem><SelectItem value="Van">Van</SelectItem><SelectItem value="Car">Car</SelectItem></SelectContent></Select>)}/></div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Capacity</Label><Input type="number" {...register('capacity')} />{errors.capacity && <p className="text-destructive text-xs">{errors.capacity.message}</p>}</div>
                    <div className="space-y-2"><Label>Driver</Label><Controller name="driverId" control={control} render={({field}) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Assign Driver"/></SelectTrigger><SelectContent>{allDrivers.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select>)}/></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Insurance Due</Label><Input type="date" {...register('insuranceDue')} />{errors.insuranceDue && <p className="text-destructive text-xs">{errors.insuranceDue.message}</p>}</div>
                    <div className="space-y-2"><Label>PUC Due</Label><Input type="date" {...register('pucDue')} />{errors.pucDue && <p className="text-destructive text-xs">{errors.pucDue.message}</p>}</div>
                 </div>
                 <div className="space-y-2"><Label>Status</Label><Controller name="status" control={control} render={({field}) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="In Service">In Service</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select>)}/></div>
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Vehicle</Button>
            </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
