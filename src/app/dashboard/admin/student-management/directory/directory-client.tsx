
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studentDirectory, type StudentProfile } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Status = StudentProfile['status'];

export function DirectoryClient() {
  const [students] = useState<StudentProfile[]>(studentDirectory);
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
        const matchesFilter = filter === 'All' || student.status === filter;
        const matchesSearch = searchTerm === '' ||
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${student.class}-${student.section}`.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
  }, [students, filter, searchTerm]);

  const getStatusBadge = (status: Status) => {
    switch(status) {
      case 'Active': return <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/20">Active</Badge>;
      case 'Alumni': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 border-blue-500/20">Alumni</Badge>;
      case 'Transferred': return <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 border-orange-500/20">Transferred</Badge>;
      case 'Archived': return <Badge variant="destructive" className="bg-gray-500/20 text-gray-400 border-gray-500/20">Archived</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleRowClick = (studentId: string) => {
    router.push(`/dashboard/admin/student-management/directory/${studentId}`);
  };

  return (
    <Card className="glassmorphic">
      <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>A comprehensive directory of all students.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Status | 'All')}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="Alumni">Alumni</TabsTrigger>
              <TabsTrigger value="Transferred">Transferred</TabsTrigger>
              <TabsTrigger value="Archived">Archived</TabsTrigger>
            </TabsList>
             <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name, class, ID..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          <TabsContent value={filter}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent Name</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                  <p>No students found for this filter.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
