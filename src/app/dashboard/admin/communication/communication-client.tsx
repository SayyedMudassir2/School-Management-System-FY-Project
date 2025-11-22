
'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, PlusCircle, Users, Briefcase, GraduationCap, Shell, Search, Paperclip, Calendar as CalendarIcon, Clock, Radio, Save, Eye, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Message content is required").max(1600, "Message cannot exceed 1600 characters."),
  recipientGroup: z.string().min(1, "Recipient group is required"),
  sendVia: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one delivery method.",
  }),
  scheduleType: z.enum(["now", "later"]),
  scheduleDate: z.date().optional(),
  attachment: z.any().optional(),
  sentAt: z.string().optional(),
});

type Announcement = z.infer<typeof announcementSchema>;

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: "Parent-Teacher Meeting Scheduled",
    content: "Please be advised that the quarterly parent-teacher meetings will be held next Friday. Sign-up sheets will be sent out tomorrow.",
    recipientGroup: "Parents",
    sendVia: ['Email', 'App Notification'],
    scheduleType: 'now',
    sentAt: new Date(Date.UTC(2024, 7, 10, 10, 0, 0)).toISOString()
  },
  {
    id: '2',
    title: "Annual Sports Day",
    content: "Registrations for the Annual Sports Day are now open. Please encourage students to participate. The event will be on the 25th of this month.",
    recipientGroup: "All Users",
    sendVia: ['Email', 'SMS'],
    scheduleType: 'now',
    sentAt: new Date(Date.UTC(2024, 7, 8, 14, 30, 0)).toISOString()
  },
];

const recipientGroups = [
  "All Users", "All Students", "All Parents", "All Teachers",
  "Class 10-A", "Class 10-B", "Class 9-A",
  "Transport Route 1", "Hostel A",
  "Fee Defaulters", "Today Absent",
] as const;

const sendViaOptions = [
    { id: 'sms', label: 'SMS' },
    { id: 'email', label: 'Email' },
    { id: 'app', label: 'App Notification' }
];

export function CommunicationClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<Omit<Announcement, 'id' | 'sentAt'>>({
    resolver: zodResolver(announcementSchema.omit({ id: true, sentAt: true })),
    defaultValues: {
      title: "",
      content: "",
      recipientGroup: "All Users",
      sendVia: ["email"],
      scheduleType: "now",
    }
  });

  const messageLength = watch('content')?.length || 0;
  const scheduleType = watch('scheduleType');

  const onSubmit: SubmitHandler<Omit<Announcement, 'id' | 'sentAt'>> = (data) => {
    const newAnnouncement: Announcement = {
      ...data,
      id: (announcements.length + 1).toString(),
      sentAt: new Date().toISOString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Quick Send</CardTitle>
                    <CardDescription>Compose and send a new message to your school community.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g., Holiday Announcement" {...register("title")} />
                            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Message</Label>
                            <Textarea id="content" placeholder="Type your message here..." {...register("content")} rows={6} className="text-base"/>
                            <div className="flex justify-between items-center">
                                <p className={`text-xs ${messageLength > 1600 ? 'text-destructive' : 'text-muted-foreground'}`}>{messageLength} / 1600 characters</p>
                                {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="attachment">Attach File (Max 5MB)</Label>
                            <Input id="attachment" type="file" {...register("attachment")} className="text-muted-foreground"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="recipientGroup">Recipient Group</Label>
                                <Controller
                                    control={control}
                                    name="recipientGroup"
                                    render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger id="recipientGroup"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                        {recipientGroups.map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    )}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label>Send Via</Label>
                                <div className="flex items-center space-x-4 pt-2">
                                <Controller
                                    name="sendVia"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                        {sendViaOptions.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={item.id}
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), item.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== item.id
                                                        )
                                                    )
                                                }}
                                            />
                                            <label htmlFor={item.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {item.label}
                                            </label>
                                            </div>
                                        ))}
                                        </>
                                    )}
                                />
                                </div>
                                {errors.sendVia && <p className="text-destructive text-xs mt-1">{errors.sendVia.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Schedule</Label>
                             <Controller
                                name="scheduleType"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center gap-6">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="now" id="now" />
                                            <Label htmlFor="now">Send Now</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="later" id="later" />
                                            <Label htmlFor="later">Schedule for Later</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                        {scheduleType === 'later' && (
                             <div className="grid grid-cols-2 gap-4 animate-in fade-in-0 duration-300">
                                <Controller
                                    name="scheduleDate"
                                    control={control}
                                    render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    )}
                                />
                                <Input type="time" />
                            </div>
                        )}
                         <CardFooter className="px-0 pt-6 flex flex-wrap gap-2 justify-between">
                            <div>
                                <Button type="button" variant="ghost"><Save className="mr-2 h-4 w-4" /> Save as Template</Button>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline"><Eye className="mr-2 h-4 w-4" /> Preview</Button>
                                <Button type="submit"><Send className="mr-2 h-4 w-4" /> Send Message</Button>
                            </div>
                         </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Quick Stats (This Month)</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold">1,240</p>
                        <p className="text-xs text-muted-foreground">SMS Sent</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">890</p>
                        <p className="text-xs text-muted-foreground">Emails</p>
                    </div>
                     <div>
                        <p className="text-2xl font-bold">3,100</p>
                        <p className="text-xs text-muted-foreground">Push</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <div className="w-full text-center p-2 rounded-lg bg-secondary/50">
                        <p className="font-bold text-lg">Remaining: 8,420 SMS</p>
                    </div>
                </CardFooter>
            </Card>
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                    <CardDescription>Last 10 messages sent.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {announcements.slice(0, 10).map(ann => (
                        <div key={ann.id} className="text-sm">
                            <p className="font-semibold truncate">{ann.title}</p>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>To: {ann.recipientGroup}</span>
                                <span>{format(new Date(ann.sentAt!), 'dd MMM')}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Today's Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No events or holidays today.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
