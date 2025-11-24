
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { PlusCircle, MoreHorizontal, Edit, Trash2, File, Video, FileText } from 'lucide-react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const materialSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  classId: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  file: z.any().refine(file => file?.length > 0, 'File is required.'),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

type Material = {
  id: string;
  title: string;
  classId: string;
  subject: string;
  fileType: string;
  fileName: string;
  uploadDate: string;
};

const initialMaterials: Material[] = [
    { id: 'SM01', title: 'Chapter 1: The Living World - Notes', classId: '10a', subject: 'Biology', fileType: 'pdf', fileName: 'bio_ch1_notes.pdf', uploadDate: '2024-07-15' },
    { id: 'SM02', title: 'Quadratic Equations - Practice Sheet', classId: '10a', subject: 'Mathematics', fileType: 'pdf', fileName: 'math_quad_prac.pdf', uploadDate: '2024-07-12' },
    { id: 'SM03', title: 'Lab Safety Video', classId: '9b', subject: 'Chemistry', fileType: 'video', fileName: 'lab_safety.mp4', uploadDate: '2024-07-10' },
];

const subjects = ["Mathematics", "Biology", "History", "Physics", "English", "Chemistry"];

type MaterialsClientProps = {
  classes: { id: string; name: string; }[];
};

export function MaterialsClient({ classes }: MaterialsClientProps) {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  const classMap = useMemo(() => new Map(classes.map(c => [c.id, c.name])), [classes]);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
  });
  
  const filteredMaterials = useMemo(() => {
      return materials.filter(m => 
        (classFilter === 'all' || m.classId === classFilter) &&
        (subjectFilter === 'all' || m.subject === subjectFilter)
      );
  }, [materials, classFilter, subjectFilter]);

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') return <FileText className="h-4 w-4 text-red-500" />;
    if (fileType.startsWith('video')) return <Video className="h-4 w-4 text-blue-500" />;
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const handleOpenDialog = (material: Material | null = null) => {
    setEditingMaterial(material);
    if (material) {
        // Since we are not actually editing files, we can just prefill other fields
        reset({
            title: material.title,
            classId: material.classId,
            subject: material.subject,
        });
    } else {
        reset({ title: '', classId: '', subject: '', file: null });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<MaterialFormValues> = (data) => {
    const file = data.file[0];
    const fileType = file.type.split('/')[0];
    const newMaterial: Material = {
      id: `SM${Date.now()}`,
      title: data.title,
      classId: data.classId,
      subject: data.subject,
      fileType: file.type.includes('pdf') ? 'pdf' : fileType,
      fileName: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial.id ? { ...newMaterial, id: editingMaterial.id } : m));
      toast({ title: 'Success', description: 'Material has been updated.' });
    } else {
      setMaterials([newMaterial, ...materials]);
      toast({ title: 'Success', description: 'New material has been uploaded.' });
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (materialId: string) => {
      setMaterials(materials.filter(m => m.id !== materialId));
      toast({ variant: 'destructive', title: 'Deleted', description: 'Study material has been removed.'})
  }

  return (
    <>
      <Card className="glassmorphic">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>My Materials</CardTitle>
              <CardDescription>A digital library of all your uploaded resources.</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Upload New Material
            </Button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
             <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Class</TableHead><TableHead>Subject</TableHead><TableHead>File</TableHead><TableHead>Uploaded On</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.title}</TableCell>
                    <TableCell>{classMap.get(material.classId) || 'N/A'}</TableCell>
                    <TableCell><Badge variant="secondary">{material.subject}</Badge></TableCell>
                    <TableCell className="flex items-center gap-2">
                        {getFileIcon(material.fileType)}
                        <span className="text-sm">{material.fileName}</span>
                    </TableCell>
                    <TableCell>{format(new Date(material.uploadDate), 'dd MMM, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenDialog(material)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(material.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {filteredMaterials.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No materials found for the selected filters.</p>
                </div>
            )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingMaterial ? 'Edit Material' : 'Upload New Material'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Controller name="classId" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger>
                      <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  )}/>
                   {errors.classId && <p className="text-destructive text-xs">{errors.classId.message}</p>}
                </div>
                <div className="space-y-2">
                   <Label>Subject</Label>
                  <Controller name="subject" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select Subject"/></SelectTrigger>
                      <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  )}/>
                  {errors.subject && <p className="text-destructive text-xs">{errors.subject.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="file">Attach File (PDF, Video, Docs)</Label>
                  <Input id="file" type="file" {...register('file')} />
                  {errors.file && <p className="text-destructive text-xs">{errors.file.message as string}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Material</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
