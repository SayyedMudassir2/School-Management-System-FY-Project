// src/ai/flows/attendance-insights.ts
'use server';
/**
 * @fileOverview This file contains the Genkit flow for generating attendance insights for teachers.
 *
 * - `getAttendanceInsights` -  A function that takes in student attendance records and generates insights about attendance trends, potential truancy, and suggested interventions.
 * - `AttendanceInsightsInput` - The input type for the getAttendanceInsights function.
 * - `AttendanceInsightsOutput` - The return type for the getAttendanceInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceRecordSchema = z.object({
  studentId: z.string().describe('Unique identifier for the student.'),
  date: z.string().describe('Date of the attendance record (YYYY-MM-DD).'),
  isPresent: z.boolean().describe('Whether the student was present or not.'),
});

const AttendanceInsightsInputSchema = z.object({
  attendanceRecords: z.array(AttendanceRecordSchema).describe('Array of student attendance records.'),
  classDetails: z.string().describe('Details about the class, including subject and grade level.'),
});
export type AttendanceInsightsInput = z.infer<typeof AttendanceInsightsInputSchema>;

const AttendanceInsightsOutputSchema = z.object({
  overallAttendanceTrend: z.string().describe('Overall attendance trend for the class.'),
  potentialTruancy: z.array(
    z.object({
      studentId: z.string().describe('Student ID'),
      numberOfAbsences: z.number().describe('Number of Absences'),
    })
  ).describe('List of students with potential truancy patterns and their number of absences.'),
  suggestedInterventions: z.string().describe('Suggested interventions to address attendance issues.'),
});
export type AttendanceInsightsOutput = z.infer<typeof AttendanceInsightsOutputSchema>;

export async function getAttendanceInsights(input: AttendanceInsightsInput): Promise<AttendanceInsightsOutput> {
  return attendanceInsightsFlow(input);
}

const attendanceInsightsPrompt = ai.definePrompt({
  name: 'attendanceInsightsPrompt',
  input: {schema: AttendanceInsightsInputSchema},
  output: {schema: AttendanceInsightsOutputSchema},
  prompt: `You are an AI assistant that helps teachers understand student attendance trends and identify potential truancy issues.

  Analyze the following attendance records for the class: {{{classDetails}}}
  Attendance Records:
  {{#each attendanceRecords}}
  - Student ID: {{studentId}}, Date: {{date}}, Present: {{isPresent}}
  {{/each}}

  Based on this data, provide the following insights:
  - Overall attendance trend for the class.
  - Identify students with potential truancy patterns, include student ID and number of absences.
  - Suggest interventions that the teacher can implement to address attendance issues.

  Make sure that the output is valid JSON according to this schema: {{outputSchema}}.
`,
});

const attendanceInsightsFlow = ai.defineFlow(
  {
    name: 'attendanceInsightsFlow',
    inputSchema: AttendanceInsightsInputSchema,
    outputSchema: AttendanceInsightsOutputSchema,
  },
  async input => {
    const {output} = await attendanceInsightsPrompt(input);
    return output!;
  }
);
