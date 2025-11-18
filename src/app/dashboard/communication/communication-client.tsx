
'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, PlusCircle, Users, Briefcase, GraduationCap, Shell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Message content is required"),
  recipientGroup: z.enum(["All Users", "Teachers", "Students", "Parents"]),
  sentAt: z.string(),
});

type Announcement = z.infer<typeof announcementSchema>;

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: "Parent-Teacher Meeting Scheduled",
    content: "Please be advised that the quarterly parent-teacher meetings will be held next Friday.  Sign-up sheets will be sent out tomorrow.",
    recipientGroup: "Parents",
    sentAt: "2024-08-10T10:00:00Z"
  },
  {
    id: '2',
    title: "Annual Sports Day",
    content: "Registrations for the Annual Sports Day are now open.  Please encourage students to participate. The event will be on the 25th of this month.",
    recipientGroup: "All Users",
    sentAt: "2024-08-08T14:30:00Z"
  },
];

const recipientGroups = ["All Users", "Teachers", "Students", "Parents"] as const;

const groupIcons: { [key in typeof recipientGroups[number]]: React.ElementType } = {
  "All Users": Users,
  "Teachers": Briefcase,
  "Students": GraduationCap,
  "Parents": Shell,
};

export function CommunicationClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<Omit<Announcement, 'id' | 'sentAt'>>({
    resolver: zodResolver(announcementSchema.omit({ id: true, sentAt: true })),
    defaultValues: {
      recipientGroup: "All Users",
    }
  });

  const onSubmit: SubmitHandler<Omit<Announcement, 'id' | 'sentAt'>> = (data) => {
    const newAnnouncement: Announcement = {
      ...data,
      id: (announcements.length + 1).toString(),
      sentAt: new Date().toISOString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setIsDialogOpen(false);
    reset();
  };
  
  const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), "dd MMM yyyy, h:mm a");
    } catch {
        return "Invalid Date";
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card className="glassmorphic">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Announcements</CardTitle>
                            <CardDescription>A log of all sent communications.</CardDescription>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> New Announcement
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {announcements.map((ann) => (
                        <div key={ann.id} className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    {React.createElement(groupIcons[ann.recipientGroup], { className: "h-5 w-5 text-primary" })}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-foreground">{ann.title}</p>
                                    <span className="text-xs text-muted-foreground">{formatDate(ann.sentAt)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{ann.content}</p>
                                <Badge variant="secondary" className="mt-2">{ann.recipientGroup}</Badge>
                            </div>
                        </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
             <Card className="glassmorphic sticky top-20">
                <CardHeader>
                    <CardTitle>Quick Message</CardTitle>
                    <CardDescription>Quickly send a new announcement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="title-quick">Title</Label>
                            <Input id="title-quick" {...register("title")} />
                            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="recipientGroup-quick">Recipient Group</Label>
                            <Controller
                                control={control}
                                name="recipientGroup"
                                render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="recipientGroup-quick"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                    {recipientGroups.map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                )}
                            />
                        </div>
                        <div>
                            <Label htmlFor="content-quick">Message</Label>
                            <Textarea id="content-quick" {...register("content")} rows={5} />
                             {errors.content && <p className="text-destructive text-xs mt-1">{errors.content.message}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            <Send className="mr-2 h-4 w-4" /> Send Announcement
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
            <DialogDescription>
              Compose a message to be sent to a group of users.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title-dialog">Title</Label>
                <Input id="title-dialog" {...register("title")} />
                {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientGroup-dialog">Recipient Group</Label>
                <Controller
                    control={control}
                    name="recipientGroup"
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="recipientGroup-dialog"><SelectValue /></SelectTrigger>
                        <SelectContent>
                        {recipientGroups.map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-dialog">Message</Label>
                <Textarea id="content-dialog" {...register("content")} rows={8} />
                 {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" /> Send Announcement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

