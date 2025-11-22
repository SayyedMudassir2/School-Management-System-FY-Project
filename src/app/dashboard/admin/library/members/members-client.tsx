'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, User, UserX, UserCheck, Users, BadgeDollarSign, BookUp, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type StudentProfile, type TeacherProfile, type BookIssuance } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';

type Member = {
  id: string;
  memberId: string;
  name: string;
  avatar: string;
  type: 'Student' | 'Teacher';
  status: 'Active' | 'Inactive' | 'Blocked';
  issuedBooks: number;
  totalFine: number;
  email: string; // Add email for export
};

type MembersClientProps = {
  students: StudentProfile[];
  teachers: TeacherProfile[];
  issuances: BookIssuance[];
};

type StatusFilter = 'All' | 'Active' | 'Inactive' | 'Blocked';

export function MembersClient({ students, teachers, issuances }: MembersClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const combinedMembers = useMemo((): Member[] => {
    const studentMembers: Member[] = students.map(s => ({
      id: s.id,
      memberId: s.admissionNo,
      name: s.name,
      avatar: s.avatar,
      type: 'Student',
      status: s.status === 'Active' ? 'Active' : 'Inactive',
      issuedBooks: issuances.filter(i => i.studentId === s.id && !i.returnDate).length,
      totalFine: issuances.filter(i => i.studentId === s.id && i.fine > 0 && !i.finePaid).reduce((sum, i) => sum + i.fine, 0),
      email: s.email,
    }));

    const teacherMembers: Member[] = teachers.map(t => ({
      id: t.id,
      memberId: t.employeeId,
      name: t.name,
      avatar: t.avatar,
      type: 'Teacher',
      status: t.status,
      issuedBooks: 0, // Assuming teachers don't borrow for this example
      totalFine: 0,
      email: t.email,
    }));
    
    return [...studentMembers, ...teacherMembers];
  }, [students, teachers, issuances]);
  
  const [members, setMembers] = useState<Member[]>(combinedMembers);
  const [filter, setFilter] = useState<StatusFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
        const matchesFilter = filter === 'All' || member.status === filter;
        const matchesSearch = searchTerm === '' ||
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
  }, [members, filter, searchTerm]);

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter(m => m.status === 'Active').length,
    withFines: members.filter(m => m.totalFine > 0).length,
  }), [members]);

  const getStatusBadge = (status: Member['status']) => {
    switch(status) {
      case 'Active': return <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/20">Active</Badge>;
      case 'Inactive': return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/20">Inactive</Badge>;
      case 'Blocked': return <Badge variant="destructive">Blocked</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleStatusChange = (memberId: string, newStatus: Member['status']) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, status: newStatus } : m));
    toast({ title: 'Status Updated', description: `Member status has been changed to ${newStatus}.` });
  };

  const handleViewProfile = (member: Member) => {
    if (member.type === 'Student') {
      router.push(`/dashboard/admin/student-management/directory/${member.id}`);
    } else {
      // For now, teacher profile links to the main teacher list
      router.push(`/dashboard/admin/teacher-management/list`);
      toast({
        title: 'Teacher Profile',
        description: 'Teacher-specific profile pages are under development. Navigating to the staff directory.'
      })
    }
  };

  const handleExport = () => {
    const dataToExport = filteredMembers.map(member => ({
      'Member ID': member.memberId,
      'Name': member.name,
      'Email': member.email,
      'Type': member.type,
      'Status': member.status,
      'Books Issued': member.issuedBooks,
      'Fine Due ($)': member.totalFine,
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'library-members.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
     toast({
      title: 'Export Complete',
      description: `${dataToExport.length} member records have been exported.`,
    });
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.active}</div></CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members with Fines</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.withFines}</div></CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Issued</CardTitle>
            <BookUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{issuances.filter(i => !i.returnDate).length}</div></CardContent>
        </Card>
      </div>

      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Members Directory</CardTitle>
          <CardDescription>A complete list of all library members.</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 pt-4">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as StatusFilter)}>
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Active">Active</TabsTrigger>
                <TabsTrigger value="Inactive">Inactive</TabsTrigger>
                <TabsTrigger value="Blocked">Blocked</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or ID..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleExport}><FileText className="mr-2 h-4 w-4"/>Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Books Issued</TableHead>
                  <TableHead>Fine Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </TableCell>
                    <TableCell>{member.memberId}</TableCell>
                    <TableCell>{member.type}</TableCell>
                    <TableCell>{member.issuedBooks}</TableCell>
                    <TableCell>${member.totalFine.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewProfile(member)}><User className="mr-2 h-4 w-4" /> View Profile</DropdownMenuItem>
                          {member.status !== 'Blocked' && 
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleStatusChange(member.id, 'Blocked')}>
                              <UserX className="mr-2 h-4 w-4" /> Block Member
                            </DropdownMenuItem>
                          }
                          {member.status === 'Blocked' &&
                             <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'Active')}>
                              <UserCheck className="mr-2 h-4 w-4" /> Unblock Member
                            </DropdownMenuItem>
                          }
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredMembers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No members found for the selected filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
