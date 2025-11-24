
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { File, Video, FileText, Download, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
    { id: 'SM04', title: 'World War II - Timeline', classId: '10a', subject: 'History', fileType: 'pdf', fileName: 'history_ww2.pdf', uploadDate: '2024-07-18' },
];

const subjects = ["Mathematics", "Biology", "History", "Physics", "English", "Chemistry"];

type MaterialsClientProps = {
  classes: { id: string; name: string; }[];
};

export function MaterialsClient({ classes }: MaterialsClientProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const materialsBySubject = useMemo(() => {
    const filtered = initialMaterials.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc, material) => {
      if (!acc[material.subject]) {
        acc[material.subject] = [];
      }
      acc[material.subject].push(material);
      return acc;
    }, {} as Record<string, Material[]>);
  }, [searchTerm]);

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.startsWith('video')) return <Video className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handleDownload = (fileName: string) => {
      toast({
          title: "Downloading...",
          description: `${fileName} will be downloaded shortly.`
      })
  }

  return (
    <Card className="glassmorphic">
        <CardHeader>
            <CardTitle>Resource Library</CardTitle>
            <CardDescription>Find and download all your study materials here.</CardDescription>
            <div className="relative mt-4 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by title or subject..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            {Object.keys(materialsBySubject).length > 0 ? (
                <Accordion type="multiple" className="w-full">
                {Object.entries(materialsBySubject).map(([subject, materials]) => (
                    <AccordionItem value={subject} key={subject}>
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">{subject}</AccordionTrigger>
                        <AccordionContent className="pl-2">
                           <div className="space-y-3">
                            {materials.map(material => (
                                <div key={material.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-4">
                                        {getFileIcon(material.fileType)}
                                        <div>
                                            <p className="font-medium">{material.title}</p>
                                            <p className="text-xs text-muted-foreground">Uploaded: {format(new Date(material.uploadDate), 'dd MMM, yyyy')}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleDownload(material.fileName)}>
                                        <Download className="h-4 w-4 mr-2"/> Download
                                    </Button>
                                </div>
                            ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No study materials found matching your search.</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
