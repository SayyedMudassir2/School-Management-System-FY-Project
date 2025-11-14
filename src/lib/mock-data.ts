import { AttendanceRecordSchema } from "@/ai/flows/attendance-insights";
import { z } from "zod";

export const classes = [
  { id: '10a', name: 'Class 10-A' },
  { id: '10b', name: 'Class 10-B' },
  { id: '11a', name: 'Class 11-A' },
];

export const students = [
  { id: 'S001', name: 'Alice Johnson' },
  { id: 'S002', name: 'Bob Williams' },
  { id: 'S003', name: 'Charlie Brown' },
  { id: 'S004', name: 'David Miller' },
  { id: 'S005', name: 'Eve Davis' },
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
