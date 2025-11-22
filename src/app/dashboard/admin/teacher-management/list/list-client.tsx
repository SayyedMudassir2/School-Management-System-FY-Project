
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Edit, User, XOctagon, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type TeacherProfile } from "@/lib/mock-data";
import { format } from 'date-fns';

type ListClientProps = {
  teachers: TeacherProfile[];
};

type Status = 'Active' | 'Inactive' | 'All';

export function ListClient({ teachers: initialTeachers }: ListClientProps) {
  const [teachers, setTeachers] = useState<TeacherProfile[]>(initialTeachers);
  const [filter, setFilter] = useState<Status>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const newTeacherData = sessionStorage.getItem('newTeacher');
    if (newTeacherData) {
      try {
        const newTeacher = JSON.parse(newTeacherData);
        // Add the new teacher to the start of the list
        setTeachers(prevTeachers => [newTeacher, ...prevTeachers]);
        // Clean up session storage
        sessionStorage.removeItem('newTeacher');
      } catch (error) {
        console.error("Failed to parse new teacher data from sessionStorage", error);
      }
    }
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
        const matchesFilter = filter === 'All' || teacher.status === filter;
        const matchesSearch = searchTerm === '' ||
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.department.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
  }, [teachers, filter, searchTerm]);

  const getStatusBadge = (status: TeacherProfile['status']) => {
    switch(status) {
      case 'Active': return <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/20">Active</Badge>;
      case 'Inactive': return <Badge variant="destructive" className="bg-gray-500/20 text-gray-400 border-gray-500/20">Inactive</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="glassmorphic">
      <CardHeader>
          <CardTitle>Staff List</CardTitle>
          <CardDescription>A comprehensive directory of all faculty and staff.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Status)}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="Inactive">Inactive</TabsTrigger>
            </TabsList>
             <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name, ID, email..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{teacher.name}</p>
                            <p className="text-xs text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.employeeId}</TableCell>
                    <TableCell>{teacher.designation}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>{format(new Date(teacher.joinDate), 'dd MMM, yyyy')}</TableCell>
                    <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem><User className="mr-2 h-4 w-4" /> View Profile</DropdownMenuItem>
                            <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Documents</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <XOctagon className="mr-2 h-4 w-4" /> Disable
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredTeachers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                  <p>No staff members found for this filter.</p>
              </div>
            )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
