
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { admissionRequests as initialRequests, type AdmissionRequest } from "@/lib/mock-data";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, CheckCircle, XCircle, Hourglass, UserCheck, Search } from 'lucide-react';
import { format } from "date-fns";
import { Input } from '@/components/ui/input';

type Status = AdmissionRequest['status'];
const statuses: Status[] = ['Pending', 'Verified', 'Accepted', 'Rejected'];

export function AdmissionsClient() {
  const [requests, setRequests] = useState<AdmissionRequest[]>(initialRequests);
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const statusCounts = useMemo(() => {
    return requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {} as Record<Status, number>);
  }, [requests]);

  const handleStatusChange = (id: string, newStatus: Status) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };
  
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
        const matchesFilter = filter === 'All' || req.status === filter;
        const matchesSearch = searchTerm === '' ||
            req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.applyingForClass.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
  }, [requests, filter, searchTerm]);

  const getStatusBadge = (status: Status) => {
    switch(status) {
      case 'Pending': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/20">Pending</Badge>;
      case 'Verified': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 border-blue-500/20">Verified</Badge>;
      case 'Accepted': return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/20">Accepted</Badge>;
      case 'Rejected': return <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/20">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{requests.length}</div></CardContent>
        </Card>
        <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{statusCounts['Pending'] || 0}</div></CardContent>
        </Card>
        <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{statusCounts['Accepted'] || 0}</div></CardContent>
        </Card>
        <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{statusCounts['Rejected'] || 0}</div></CardContent>
        </Card>
      </div>

      <Card className="glassmorphic">
        <CardHeader>
            <CardTitle>Admission Requests</CardTitle>
            <CardDescription>Review and manage all incoming student admission applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as Status | 'All')}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="Verified">Verified</TabsTrigger>
                <TabsTrigger value="Accepted">Accepted</TabsTrigger>
                <TabsTrigger value="Rejected">Rejected</TabsTrigger>
              </TabsList>
               <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Search by name or class..." 
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
                    <TableHead>Student Name</TableHead>
                    <TableHead>Applying for</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.studentName}</TableCell>
                      <TableCell>{req.applyingForClass}</TableCell>
                      <TableCell>{req.parentName}</TableCell>
                      <TableCell>{format(new Date(req.submittedDate), 'dd MMM, yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            {statuses.map(status => (
                              <DropdownMenuItem 
                                key={status} 
                                onClick={() => handleStatusChange(req.id, status)}
                                disabled={req.status === status}
                              >
                                {status}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredRequests.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No admission requests found for this filter.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
