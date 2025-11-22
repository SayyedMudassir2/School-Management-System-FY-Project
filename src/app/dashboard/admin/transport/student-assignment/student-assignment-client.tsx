
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, Download, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { type StudentProfile, type TransportRoute } from '@/lib/mock-data';

type StudentAssignment = {
    studentId: string;
    routeId: string;
    stopName: string;
};

const initialAssignments: StudentAssignment[] = [
    { studentId: 'S001', routeId: 'R01', stopName: 'Medanta Hospital' },
    { studentId: 'S002', routeId: 'R01', stopName: 'Rajiv Chowk' },
    { studentId: 'S004', routeId: 'R02', stopName: 'Huda City Centre' },
];

type StudentAssignmentClientProps = {
    allStudents: StudentProfile[];
    allRoutes: TransportRoute[];
};

export function StudentAssignmentClient({ allStudents, allRoutes }: StudentAssignmentClientProps) {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
    const [assignments, setAssignments] = useState<StudentAssignment[]>(initialAssignments);
    
    const [selectedRouteId, setSelectedRouteId] = useState('');
    const [selectedStop, setSelectedStop] = useState('');

    const routeMap = useMemo(() => new Map(allRoutes.map(r => [r.id, r])), [allRoutes]);
    
    const filteredStudents = useMemo(() => {
        if (!searchTerm) return [];
        return allStudents.filter(s =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5);
    }, [searchTerm, allStudents]);

    const currentAssignment = useMemo(() => {
        if (!selectedStudent) return null;
        return assignments.find(a => a.studentId === selectedStudent.id);
    }, [selectedStudent, assignments]);
    
    const stopsForSelectedRoute = useMemo(() => {
        if (!selectedRouteId) return [];
        const route = routeMap.get(selectedRouteId);
        return route ? route.stops : [];
    }, [selectedRouteId, routeMap]);

    const handleSelectStudent = (student: StudentProfile) => {
        setSelectedStudent(student);
        const assignment = assignments.find(a => a.studentId === student.id);
        if (assignment) {
            setSelectedRouteId(assignment.routeId);
            setSelectedStop(assignment.stopName);
        } else {
            setSelectedRouteId('');
            setSelectedStop('');
        }
        setSearchTerm('');
    };

    const handleAssignRoute = () => {
        if (!selectedStudent || !selectedRouteId || !selectedStop) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a student, route, and stop.'});
            return;
        }

        setAssignments(prev => {
            const existingIndex = prev.findIndex(a => a.studentId === selectedStudent.id);
            const newAssignment = { studentId: selectedStudent.id, routeId: selectedRouteId, stopName: selectedStop };
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = newAssignment;
                return updated;
            }
            return [...prev, newAssignment];
        });
        
        toast({ title: 'Success', description: `${selectedStudent.name} assigned to route.` });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Find Student</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or admission no..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                             {filteredStudents.length > 0 && (
                                <Card className="absolute top-full mt-2 w-full z-10">
                                    <CardContent className="p-2">
                                    {filteredStudents.map(student => (
                                        <div key={student.id} onClick={() => handleSelectStudent(student)} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                                        <Avatar>
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-sm text-muted-foreground">{student.admissionNo}</p>
                                        </div>
                                        </div>
                                    ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-2">
                {selectedStudent ? (
                     <Card className="glassmorphic animate-in fade-in duration-300">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedStudent.avatar} />
                                    <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{selectedStudent.name}</CardTitle>
                                    <CardDescription>{selectedStudent.admissionNo} | {selectedStudent.class}-{selectedStudent.section}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium mb-1">Current Assignment</h3>
                                <div className="border rounded-lg p-3 text-sm">
                                    {currentAssignment ? (
                                        <p>
                                            <span className="font-semibold">{routeMap.get(currentAssignment.routeId)?.name || 'N/A'}</span>
                                            <span className="text-muted-foreground"> &rarr; {currentAssignment.stopName}</span>
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground">Not assigned to any transport route.</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold">Assign New Route</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
                                        <SelectTrigger><SelectValue placeholder="Select Route" /></SelectTrigger>
                                        <SelectContent>{allRoutes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Select value={selectedStop} onValueChange={setSelectedStop} disabled={!selectedRouteId}>
                                        <SelectTrigger><SelectValue placeholder="Select Stop" /></SelectTrigger>
                                        <SelectContent>{stopsForSelectedRoute.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter>
                            <Button onClick={handleAssignRoute}>Assign Route</Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="glassmorphic h-96 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <User className="mx-auto h-12 w-12 mb-4" />
                            <p>Search for a student to view or manage their transport assignment.</p>
                        </div>
                    </Card>
                )}
            </div>
             <div className="lg:col-span-3">
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Bulk Assign Students</CardTitle>
                        <CardDescription>Upload an Excel/CSV file to assign multiple students to routes at once.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download Sample File</Button>
                        <Input type="file" className="max-w-xs" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    </CardContent>
                    <CardFooter>
                        <Button><Upload className="mr-2 h-4 w-4" /> Upload & Process File</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
