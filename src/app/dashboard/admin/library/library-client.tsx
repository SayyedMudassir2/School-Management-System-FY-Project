'use client';

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, BookUp, BookDown, BookOpen, Book, Users, Search, AlertCircle, FileWarning, BadgeDollarSign, Star, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isAfter, isThisMonth } from "date-fns";
import Link from "next/link";

const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  subject: z.string().min(1, "Subject is required"),
  isbn: z.string().optional(),
  quantity: z.preprocess((val) => Number(val), z.number().min(0, "Quantity can't be negative")),
  available: z.preprocess((val) => Number(val), z.number().min(0, "Available can't be negative")),
});

type Book = z.infer<typeof bookSchema>;

const issueSchema = z.object({
  bookId: z.string().min(1, "A book is required"),
  studentId: z.string().min(1, "A student is required"),
});

type IssueFormData = z.infer<typeof issueSchema>;

type BookIssuance = {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  fine: number;
  finePaid: boolean;
}

type LibraryClientProps = {
  initialBooks: Book[];
  students: { id: string; name: string }[];
  initialIssuances: BookIssuance[];
};

const libraryActions = [
    {
        title: "Books Catalog",
        description: "Manage the collection of books and digital resources.",
        icon: Book,
        href: "/dashboard/admin/library"
    },
    {
        title: "Issue/Return Books",
        description: "Track borrowed books and manage returns.",
        icon: BookUp,
        href: "/dashboard/admin/library/issue-return"
    },
    {
        title: "Members",
        description: "View and manage all library members.",
        icon: Users,
        href: "#"
    },
    {
        title: "Fine Management",
        description: "Handle overdue fines and payments.",
        icon: BadgeDollarSign,
        href: "#"
    }
];

export function LibraryClient({ initialBooks, students, initialIssuances }: LibraryClientProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [issuances, setIssuances] = useState<BookIssuance[]>(initialIssuances);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [issuingBook, setIssuingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const studentMap = new Map(students.map(s => [s.id, s.name]));
  const bookMap = new Map(books.map(b => [b.id, b.title]));

  const bookForm = useForm<Book>({
    resolver: zodResolver(bookSchema),
  });

  const issueForm = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });

  const handleOpenBookDialog = (book: Book | null = null) => {
    setEditingBook(book);
    if (book) {
      bookForm.reset(book);
    } else {
      bookForm.reset({ title: "", author: "", subject: "", isbn: "", quantity: 1, available: 1 });
    }
    setIsBookDialogOpen(true);
  };

  const onBookSubmit: SubmitHandler<Book> = (data) => {
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...data } : b));
    } else {
      const newBook = { ...data, id: `B${(books.length + 10).toString().padStart(3, '0')}` };
      setBooks([...books, newBook]);
    }
    setIsBookDialogOpen(false);
  };
  
  const handleOpenIssueDialog = (book: Book) => {
    setIssuingBook(book);
    issueForm.reset({ bookId: book.id, studentId: '' });
    setIsIssueDialogOpen(true);
  };

  const onIssueSubmit: SubmitHandler<IssueFormData> = (data) => {
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 14); // 2-week borrowing period

    const newIssuance: BookIssuance = {
      id: `I${(issuances.length + 1).toString().padStart(3, '0')}`,
      bookId: data.bookId,
      studentId: data.studentId,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
      fine: 0,
      finePaid: false
    };
    
    setIssuances([...issuances, newIssuance]);
    setBooks(books.map(b => b.id === data.bookId ? { ...b, available: b.available - 1 } : b));
    setIsIssueDialogOpen(false);
  };

  const handleReturnBook = (issuanceId: string) => {
    let bookToUpdate: string | null = null;
    const updatedIssuances = issuances.map(i => {
        if (i.id === issuanceId) {
            bookToUpdate = i.bookId;
            const isOverdue = isAfter(new Date(), new Date(i.dueDate));
            // Simple fine calculation: $5 if overdue
            const fine = isOverdue && i.fine === 0 ? 5 : i.fine;
            return { ...i, returnDate: new Date().toISOString(), fine };
        }
        return i;
    });

    setIssuances(updatedIssuances);
    if (bookToUpdate) {
        setBooks(books.map(b => b.id === bookToUpdate ? { ...b, available: b.available + 1 } : b));
    }
  };

  const handlePayFine = (issuanceId: string) => {
    setIssuances(issuances.map(i => i.id === issuanceId ? { ...i, finePaid: true } : i));
  };

  const {
    totalBooks,
    pendingReturns,
    overdueBooks,
    totalFine,
    fineCollectedThisMonth,
    mostBorrowed,
  } = useMemo(() => {
    const now = new Date();
    const currentIssuances = issuances.filter(i => !i.returnDate);
    
    const overdue = currentIssuances.filter(i => isAfter(now, new Date(i.dueDate)));
    const totalFineAmt = overdue.reduce((sum, i) => sum + i.fine, 0);

    const collectedThisMonth = issuances.filter(i => 
      i.finePaid && i.returnDate && isThisMonth(new Date(i.returnDate))
    ).reduce((sum, i) => sum + i.fine, 0);
    
    const borrowCounts = issuances.reduce((acc, i) => {
        acc[i.bookId] = (acc[i.bookId] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topBorrowed = Object.entries(borrowCounts)
      .sort(([,a],[,b]) => b - a)
      .slice(0, 5)
      .map(([bookId, count]) => ({ bookId, title: bookMap.get(bookId) || "Unknown Book", count }));

    return {
      totalBooks: books.reduce((sum, book) => sum + book.quantity, 0),
      pendingReturns: currentIssuances.length,
      overdueBooks: overdue.length,
      totalFine: totalFineAmt,
      fineCollectedThisMonth: collectedThisMonth,
      mostBorrowed: topBorrowed,
    };
  }, [books, issuances, bookMap]);

  const bookWithIssuance = useMemo(() => {
    const issuanceMap = new Map<string, BookIssuance[]>();
    issuances.filter(i => !i.returnDate).forEach(i => {
      const bookIssuances = issuanceMap.get(i.bookId) || [];
      bookIssuances.push(i);
      issuanceMap.set(i.bookId, bookIssuances);
    });
    return issuanceMap;
  }, [issuances]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  return (
    <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="glassmorphic">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
                    <BookUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingReturns}</div>
                    <p className="text-xs text-muted-foreground">Currently borrowed by students</p>
                </CardContent>
            </Card>
            <Card className="glassmorphic">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
                    <FileWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overdueBooks}</div>
                    <p className="text-xs text-muted-foreground">Total outstanding fine: ${totalFine}</p>
                </CardContent>
            </Card>
            <Card className="glassmorphic">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Fine Collected</CardTitle>
                    <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${fineCollectedThisMonth}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
            </Card>
            <Card className="glassmorphic">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalBooks}</div>
                    <p className="text-xs text-muted-foreground">Across all subjects</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {libraryActions.map((action) => (
                <Card key={action.title} className="glassmorphic">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <action.icon className="h-6 w-6 text-primary" />
                            {action.title}
                        </CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild>
                            <Link href={action.href}>
                                Manage <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="glassmorphic">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>Book Inventory</CardTitle>
                                <CardDescription>A list of all books in the library.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenBookDialog()}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add New Book
                            </Button>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by title, author, or subject..." 
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBooks.map(book => {
                                const isIssued = (bookWithIssuance.get(book.id!) || []).length > 0;
                                return (
                                    <TableRow key={book.id}>
                                        <TableCell className="font-medium">{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.subject}</TableCell>
                                        <TableCell>
                                            <Badge variant={book.available > 0 ? 'default' : 'secondary'} className={book.available > 0 ? 'bg-green-500/20 text-green-700 border-green-500/20' : ''}>
                                                {book.available} / {book.quantity} Available
                                            </Badge>
                                        </TableCell>
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
                                            <DropdownMenuItem onClick={() => handleOpenIssueDialog(book)} disabled={book.available === 0}>
                                                <BookUp className="mr-2 h-4 w-4" />
                                                Issue Book
                                            </DropdownMenuItem>
                                            {isIssued && <DropdownMenuSeparator />}
                                            {isIssued && <DropdownMenuLabel>Issued To</DropdownMenuLabel>}
                                            {(bookWithIssuance.get(book.id!) || []).map(issuance => (
                                                <DropdownMenuItem key={issuance.id} onClick={() => handleReturnBook(issuance.id)}>
                                                    <BookDown className="mr-2 h-4 w-4" />
                                                    <span>Return from {studentMap.get(issuance.studentId)}</span>
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleOpenBookDialog(book)}>
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                View/Edit
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                 <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500" />Most Borrowed Books</CardTitle>
                        <CardDescription>Top 5 most popular books.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book Title</TableHead>
                                    <TableHead className="text-right">Borrows</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mostBorrowed.map(book => (
                                    <TableRow key={book.bookId}>
                                        <TableCell className="font-medium">{book.title}</TableCell>
                                        <TableCell className="text-right">{book.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
        

        <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
            <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
                <DialogDescription>
                    {editingBook ? "Update the details for this book." : "Enter details for a new book."}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={bookForm.handleSubmit(onBookSubmit)}>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...bookForm.register("title")} />
                        {bookForm.formState.errors.title && <p className="text-destructive text-xs">{bookForm.formState.errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" {...bookForm.register("author")} />
                        {bookForm.formState.errors.author && <p className="text-destructive text-xs">{bookForm.formState.errors.author.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" {...bookForm.register("subject")} />
                        {bookForm.formState.errors.subject && <p className="text-destructive text-xs">{bookForm.formState.errors.subject.message}</p>}
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Total Quantity</Label>
                            <Input id="quantity" type="number" {...bookForm.register("quantity")} />
                            {bookForm.formState.errors.quantity && <p className="text-destructive text-xs">{bookForm.formState.errors.quantity.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="available">Available</Label>
                            <Input id="available" type="number" {...bookForm.register("available")} />
                            {bookForm.formState.errors.available && <p className="text-destructive text-xs">{bookForm.formState.errors.available.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input id="isbn" {...bookForm.register("isbn")} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsBookDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>
        
        <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Issue Book: {issuingBook?.title}</DialogTitle>
                    <DialogDescription>Select a student to issue this book to.</DialogDescription>
                </DialogHeader>
                <form onSubmit={issueForm.handleSubmit(onIssueSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="studentId">Student</Label>
                            <Controller
                                control={issueForm.control}
                                name="studentId"
                                render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="studentId">
                                        <SelectValue placeholder="Select a student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                )}
                            />
                            {issueForm.formState.errors.studentId && <p className="text-destructive text-xs">{issueForm.formState.errors.studentId.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsIssueDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Issue Book</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </>
  );
}
