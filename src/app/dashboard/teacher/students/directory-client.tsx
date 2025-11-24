
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, FileText, Printer } from 'lucide-react';
import { studentDirectory, type StudentProfile } from "@/lib/mock-data";
import { useToast } from '@/hooks/use-toast';

type StudentDirectoryClientProps = {
    students: StudentProfile[];
    classes: { id: string; name: string; }[];
}

export function StudentDirectoryClient({ students, classes }: StudentDirectoryClientProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
        const studentClass = `Class ${student.class}-${student.section}`;
        const matchesFilter = filter === 'all' || classes.find(c => c.id === filter)?.name === studentClass;
        const matchesSearch = searchTerm === '' ||
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
  }, [students, filter, searchTerm, classes]);

  const handleRowClick = (studentId: string) => {
    router.push(`/dashboard/teacher/students/${studentId}`);
  };
  
  const handleSendEmail = () => {
    if (filteredStudents.length === 0) {
      toast({
        variant: "destructive",
        title: "No students to email",
        description: "Please adjust your filters to select students.",
      });
      return;
    }
    // Assuming parent email is derivable or a placeholder. In a real app, this would be a dedicated field.
    const parentEmails = filteredStudents.map(student => `parent.${student.email.split('@')[0]}@example.com`);
    const bccEmails = parentEmails.join(',');
    window.location.href = `mailto:?bcc=${bccEmails}&subject=Aedura School Announcement`;
  };


  const handleBulkAction = (action: string) => {
    toast({
        title: "Action Triggered",
        description: `The '${action}' bulk action is a placeholder and would be implemented in a real application.`
    });
  }

  return (
    <Card className="glassmorphic">
      <CardHeader>
          <CardTitle>My Students</CardTitle>
          <CardDescription>A directory of students in your classes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search student..." 
                        className="pl-10 w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All My Classes</SelectItem>
                        {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={handleSendEmail}><Mail className="mr-2 h-4 w-4" /> Send Email</Button>
                <Button variant="outline" onClick={() => handleBulkAction('Export List')}><FileText className="mr-2 h-4 w-4" /> Export</Button>
            </div>
        </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} onClick={() => handleRowClick(student.id)} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell>{student.admissionNo}</TableCell>
                    <TableCell>{student.class}-{student.section}</TableCell>
                    <TableCell>{student.parentName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                  <p>No students found for the selected filters.</p>
              </div>
            )}
      </CardContent>
    </Card>
  );
}
