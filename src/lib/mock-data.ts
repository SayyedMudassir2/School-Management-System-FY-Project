
import { AttendanceRecordSchema } from "@/ai/flows/attendance-insights";
import { z } from "zod";

export const classes = [
  { id: '10a', name: 'Class 10-A' },
  { id: '10b', name: 'Class 10-B' },
  { id: '9a', name: 'Class 9-A' },
];

export const students = [
  { id: 'S001', name: 'Alice Johnson', classId: '10a' },
  { id: 'S002', name: 'Bob Williams', classId: '10a' },
  { id: 'S003', name: 'Charlie Brown', classId: '10b' },
  { id: 'S004', name: 'David Miller', classId: '9a' },
  { id: 'S005', name: 'Eve Davis', classId: '9a' },
];

const generateAttendance = (): z.infer<typeof AttendanceRecordSchema>[] => {
  const records: z.infer<typeof AttendanceRecordSchema>[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (const student of students) {
      // Make Charlie Brown absent more often
      const isPresent = student.id === 'S003' ? Math.random() > 0.4 : Math.random() > 0.1;
      records.push({
        studentId: student.id,
        date: dateString,
        isPresent,
      });
    }
  }
  return records;
};

export const mockAttendanceRecords: z.infer<typeof AttendanceRecordSchema>[] = generateAttendance();

export const attendanceChartData = [
  { date: 'Mon', attendance: 95 },
  { date: 'Tue', attendance: 92 },
  { date: 'Wed', attendance: 94 },
  { date: 'Thu', attendance: 88 },
  { date: 'Fri', attendance: 91 },
  { date: 'Sat', attendance: 100 },
  { date: 'Sun', attendance: 100 },
];

export const studentEnrollmentData = [
    { month: "Jan", enrollment: 1200 },
    { month: "Feb", enrollment: 1350 },
    { month: "Mar", enrollment: 1250 },
    { month: "Apr", enrollment: 1400 },
    { month: "May", enrollment: 1380 },
    { month: "Jun", enrollment: 1450 },
];

export const revenueOverviewData = [
    { month: "Jan", revenue: 15000 },
    { month: "Feb", revenue: 22000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 35000 },
    { month: "May", revenue: 42000 },
    { month: "Jun", revenue: 67000 },
];


export const books = [
  { id: 'B001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', subject: 'Literature', isbn: '978-0743273565', quantity: 5, available: 2 },
  { id: 'B002', title: 'To Kill a Mockingbird', author: 'Harper Lee', subject: 'Literature', isbn: '978-0061120084', quantity: 3, available: 1 },
  { id: 'B003', title: '1984', author: 'George Orwell', subject: 'Dystopian Fiction', isbn: '978-0451524935', quantity: 4, available: 4 },
  { id: 'B004', title: 'A Brief History of Time', author: 'Stephen Hawking', subject: 'Science', isbn: '978-0553380163', quantity: 2, available: 1 },
  { id: 'B005', title: 'Calculus: A Complete Course', author: 'Robert A. Adams', subject: 'Mathematics', isbn: '978-0321781079', quantity: 10, available: 8 },
  { id: 'B006', title: 'The Elements of Style', author: 'Strunk & White', subject: 'Writing', isbn: '978-0205309023', quantity: 8, available: 8 },
];

export const bookIssuances = [
  // --- Current Month ---
  // Overdue, not paid
  { id: 'I001', bookId: 'B001', studentId: 'S001', issueDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(), dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), returnDate: null, fine: 10, finePaid: false },
  // Issued, not yet due
  { id: 'I002', bookId: 'B001', studentId: 'S003', issueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), dueDate: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString(), returnDate: null, fine: 0, finePaid: false },
  // Overdue, but paid this month
  { id: 'I003', bookId: 'B002', studentId: 'S002', issueDate: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(), dueDate: new Date(new Date().setDate(new Date().getDate() - 11)).toISOString(), returnDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), fine: 15, finePaid: true },
  // On time return this month
  { id: 'I004', bookId: 'B002', studentId: 'S004', issueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), dueDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), returnDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), fine: 0, finePaid: false },
  // Overdue, not paid
  { id: 'I005', bookId: 'B004', studentId: 'S005', issueDate: new Date(new Date().setDate(new Date().getDate() - 18)).toISOString(), dueDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), returnDate: null, fine: 5, finePaid: false },
  // Issued, not yet due
  { id: 'I006', bookId: 'B005', studentId: 'S001', issueDate: new Date().toISOString(), dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), returnDate: null, fine: 0, finePaid: false },
  { id: 'I007', bookId: 'B001', studentId: 'S002', issueDate: new Date().toISOString(), dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), returnDate: null, fine: 0, finePaid: false },


  // --- Previous Months for historical data ---
  // Paid fine last month
  { id: 'I008', bookId: 'B001', studentId: 'S001', issueDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), dueDate: new Date(new Date(new Date().setMonth(new Date().getMonth() - 2)).setDate(new Date().getDate() + 5)).toISOString(), returnDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), fine: 20, finePaid: true },
  // Multiple borrows for B001
  { id: 'I009', bookId: 'B001', studentId: 'S004', issueDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(), dueDate: new Date(new Date(new Date().setMonth(new Date().getMonth() - 3)).setDate(new Date().getDate() + 14)).toISOString(), returnDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), fine: 0, finePaid: false },
  // Multiple borrows for B002
  { id: 'I010', bookId: 'B002', studentId: 'S005', issueDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), dueDate: new Date(new Date(new Date().setMonth(new Date().getMonth() - 2)).setDate(new Date().getDate() + 14)).toISOString(), returnDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(), fine: 0, finePaid: false },
  // For B005
  { id: 'I011', bookId: 'B005', studentId: 'S003', issueDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), dueDate: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(new Date().getDate() + 14)).toISOString(), returnDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), fine: 0, finePaid: false },
];

    