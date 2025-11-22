'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookUp, BookDown, User, Calendar, Check, X, Printer, IndianRupee } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type StudentProfile, type Book, type BookIssuance } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type IssueReturnClientProps = {
  students: StudentProfile[];
  allBooks: Book[];
  initialIssuances: BookIssuance[];
};

export function IssueReturnClient({ students, allBooks, initialIssuances }: IssueReturnClientProps) {
  const { toast } = useToast();
  
  // General state
  const [books, setBooks] = useState<Book[]>(allBooks);
  const [issuances, setIssuances] = useState<BookIssuance[]>(initialIssuances);

  // Issue tab state
  const [issueStudentSearch, setIssueStudentSearch] = useState('');
  const [selectedIssueStudent, setSelectedIssueStudent] = useState<StudentProfile | null>(null);
  const [issueBookSearch, setIssueBookSearch] = useState('');
  const [booksToIssue, setBooksToIssue] = useState<Book[]>([]);
  const [returnDate, setReturnDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
  });

  // Return tab state
  const [returnSearch, setReturnSearch] = useState('');
  
  const studentMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
  const bookMap = useMemo(() => new Map(books.map(b => [b.id, b])), [books]);

  // --- Issue Logic ---
  const filteredIssueStudents = useMemo(() => {
    if (!issueStudentSearch) return [];
    return students.filter(s => 
      s.name.toLowerCase().includes(issueStudentSearch.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(issueStudentSearch.toLowerCase())
    ).slice(0, 5);
  }, [issueStudentSearch, students]);

  const filteredIssueBooks = useMemo(() => {
    if (!issueBookSearch) return [];
    return books.filter(b => 
      b.available > 0 &&
      !booksToIssue.find(bi => bi.id === b.id) &&
      (b.title.toLowerCase().includes(issueBookSearch.toLowerCase()) || 
       b.isbn?.includes(issueBookSearch))
    ).slice(0, 5);
  }, [issueBookSearch, books, booksToIssue]);

  const handleSelectStudent = (student: StudentProfile) => {
    setSelectedIssueStudent(student);
    setIssueStudentSearch('');
  };

  const handleAddBookToIssue = (book: Book) => {
    setBooksToIssue([...booksToIssue, book]);
    setIssueBookSearch('');
  };

  const handleRemoveBookFromIssue = (bookId: string) => {
    setBooksToIssue(booksToIssue.filter(b => b.id !== bookId));
  };
  
  const handleIssueBooks = () => {
    if (!selectedIssueStudent || booksToIssue.length === 0 || !returnDate) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a student and at least one book.' });
        return;
    }

    const newIssuances: BookIssuance[] = booksToIssue.map(book => ({
        id: `I${Date.now()}${Math.random()}`,
        bookId: book.id!,
        studentId: selectedIssueStudent.id,
        issueDate: new Date().toISOString(),
        dueDate: returnDate.toISOString(),
        returnDate: null,
        fine: 0,
        finePaid: false
    }));

    setIssuances([...issuances, ...newIssuances]);
    setBooks(currentBooks => currentBooks.map(book => {
        if (booksToIssue.find(b => b.id === book.id)) {
            return { ...book, available: book.available - 1 };
        }
        return book;
    }));
    
    // In a real app, you would print a slip here.
    toast({ title: 'Success', description: `${booksToIssue.length} book(s) issued to ${selectedIssueStudent.name}.` });

    // Reset issue form
    setSelectedIssueStudent(null);
    setBooksToIssue([]);
    setIssueStudentSearch('');
    setIssueBookSearch('');
  };


  // --- Return Logic ---
  const filteredReturnableIssuances = useMemo(() => {
    const unreturned = issuances.filter(i => i.returnDate === null);
    if (!returnSearch) return unreturned;
    
    return unreturned.filter(i => {
        const student = studentMap.get(i.studentId);
        const book = bookMap.get(i.bookId);
        return student?.name.toLowerCase().includes(returnSearch.toLowerCase()) ||
               student?.admissionNo.toLowerCase().includes(returnSearch.toLowerCase()) ||
               book?.title.toLowerCase().includes(returnSearch.toLowerCase()) ||
               book?.isbn?.includes(returnSearch);
    });
  }, [returnSearch, issuances, studentMap, bookMap]);
  
  const calculateFine = (dueDate: string): { daysLate: number; fine: number } => {
    const lateDays = differenceInDays(new Date(), new Date(dueDate));
    if (lateDays <= 0) return { daysLate: 0, fine: 0 };
    return { daysLate: lateDays, fine: lateDays * 5 }; // Example: ₹5 per day
  };

  const handleReturn = (issuance: BookIssuance, withFine: boolean) => {
    const { fine } = calculateFine(issuance.dueDate);

    setIssuances(issuances.map(i => i.id === issuance.id ? {
      ...i,
      returnDate: new Date().toISOString(),
      fine: fine,
      finePaid: withFine
    } : i));
    
    setBooks(books.map(b => b.id === issuance.bookId ? {...b, available: b.available + 1} : b));

    toast({ title: "Book Returned", description: `${bookMap.get(issuance.bookId)?.title} has been returned.` });
  };

  return (
    <Tabs defaultValue="issue" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="issue"><BookUp className="mr-2 h-4 w-4" />Issue Books</TabsTrigger>
        <TabsTrigger value="return"><BookDown className="mr-2 h-4 w-4" />Return Books</TabsTrigger>
      </TabsList>

      {/* Issue Tab */}
      <TabsContent value="issue">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Issue New Books</CardTitle>
            <CardDescription>Search for a student and scan books to issue them.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Label htmlFor="student-search">Find Student</Label>
              <Search className="absolute left-3 top-10 h-4 w-4 text-muted-foreground" />
              <Input id="student-search" placeholder="Enter Student ID, Name, or Admission No..." value={issueStudentSearch} onChange={e => setIssueStudentSearch(e.target.value)} className="pl-10" />
              {filteredIssueStudents.length > 0 && (
                <Card className="absolute z-10 w-full mt-1">
                  <CardContent className="p-2 max-h-60 overflow-y-auto">
                    {filteredIssueStudents.map(student => (
                      <div key={student.id} onClick={() => handleSelectStudent(student)} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                        <Avatar><AvatarImage src={student.avatar} /><AvatarFallback>{student.name[0]}</AvatarFallback></Avatar>
                        <div><p className="font-medium">{student.name}</p><p className="text-sm text-muted-foreground">{student.admissionNo}</p></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {selectedIssueStudent && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-0">
                <div className="md:col-span-1">
                  <Card className="bg-muted/30">
                    <CardHeader className="p-4 items-center flex-col text-center">
                       <Avatar className="h-20 w-20 mb-2"><AvatarImage src={selectedIssueStudent.avatar} /><AvatarFallback>{selectedIssueStudent.name[0]}</AvatarFallback></Avatar>
                       <CardTitle className="text-lg">{selectedIssueStudent.name}</CardTitle>
                       <CardDescription>{selectedIssueStudent.admissionNo} | {selectedIssueStudent.class}-{selectedIssueStudent.section}</CardDescription>
                    </CardHeader>
                     <CardContent className="p-4 pt-0 text-center">
                        <p className="text-sm text-muted-foreground">Max books allowed: 5</p>
                        <p className="text-sm text-muted-foreground">Currently issued: {issuances.filter(i => i.studentId === selectedIssueStudent.id && !i.returnDate).length}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="book-search">Scan/Search Book Barcode</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="book-search" placeholder="Enter Book Title or ISBN..." value={issueBookSearch} onChange={e => setIssueBookSearch(e.target.value)} className="pl-10" />
                       {filteredIssueBooks.length > 0 && (
                        <Card className="absolute z-10 w-full mt-1">
                          <CardContent className="p-2 max-h-60 overflow-y-auto">
                            {filteredIssueBooks.map(book => (
                              <div key={book.id} onClick={() => handleAddBookToIssue(book)} className="p-2 rounded-md hover:bg-muted cursor-pointer">
                                <p className="font-medium">{book.title}</p>
                                <p className="text-sm text-muted-foreground">{book.author}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Books to Issue</Label>
                    <div className="border rounded-md min-h-[80px] p-2 space-y-2">
                        {booksToIssue.length === 0 ? <p className="text-sm text-muted-foreground text-center p-4">No books added yet.</p> :
                        booksToIssue.map(book => (
                            <div key={book.id} className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                                <div>
                                    <p className="font-medium">{book.title}</p>
                                    <p className="text-xs text-muted-foreground">{book.author}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRemoveBookFromIssue(book.id!)}><X className="h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                  </div>
                   <div>
                        <Label>Return Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !returnDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                                mode="single"
                                selected={returnDate}
                                onSelect={setReturnDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
              </div>
            )}
          </CardContent>
          {selectedIssueStudent && (
             <CardFooter>
                 <Button className="w-full md:w-auto ml-auto" size="lg" disabled={booksToIssue.length === 0} onClick={handleIssueBooks}>
                    <BookUp className="mr-2 h-4 w-4"/>Issue {booksToIssue.length} Book(s)
                 </Button>
            </CardFooter>
          )}
        </Card>
      </TabsContent>

      {/* Return Tab */}
      <TabsContent value="return">
        <Card className="glassmorphic">
           <CardHeader>
            <CardTitle>Return Books</CardTitle>
            <CardDescription>Search for a student or book to process a return.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="relative mb-6">
              <Label htmlFor="return-search">Find Issued Book</Label>
              <Search className="absolute left-3 top-10 h-4 w-4 text-muted-foreground" />
              <Input id="return-search" placeholder="Search by Student, Book Title, or ISBN..." value={returnSearch} onChange={e => setReturnSearch(e.target.value)} className="pl-10" />
            </div>
            
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Book Title</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Fine</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReturnableIssuances.length > 0 ? filteredReturnableIssuances.map(issuance => {
                            const student = studentMap.get(issuance.studentId);
                            const book = bookMap.get(issuance.bookId);
                            const { daysLate, fine } = calculateFine(issuance.dueDate);

                            return (
                                <TableRow key={issuance.id} className={daysLate > 0 ? 'bg-destructive/10' : ''}>
                                    <TableCell className="font-medium">{book?.title || 'Unknown Book'}</TableCell>
                                    <TableCell>{student?.name || 'Unknown Student'}</TableCell>
                                    <TableCell>{format(new Date(issuance.dueDate), 'dd MMM yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={fine > 0 ? 'destructive' : 'default'}>
                                            <IndianRupee className="h-3 w-3 mr-1"/>{fine} {daysLate > 0 && `(${daysLate} days)`}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {fine > 0 && <Button size="sm" variant="ghost" onClick={() => handleReturn(issuance, false)}>Waive & Return</Button>}
                                        <Button size="sm" onClick={() => handleReturn(issuance, true)}>
                                            {fine > 0 ? 'Collect Fine & Return' : 'Return Book'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No matching books to return.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
