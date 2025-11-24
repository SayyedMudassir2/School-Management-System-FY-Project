
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { type Announcement as AnnouncementType } from '@/lib/mock-data';
import { Send, Bell, Megaphone, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  target: z.string().min(1, 'Please select a target audience'),
  channels: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one notification channel.",
  }),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

type AnnouncementsClientProps = {
  classes: { id: string; name: string; }[];
  initialAnnouncements: AnnouncementType[];
};

const notificationChannels = [
    { id: 'app', label: 'App Notification' },
    { id: 'sms', label: 'SMS' },
    { id: 'email', label: 'Email' },
];

export function AnnouncementsClient({ classes, initialAnnouncements }: AnnouncementsClientProps) {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>(initialAnnouncements);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      target: '',
      channels: ['app'],
    }
  });

  const onSubmit: SubmitHandler<AnnouncementFormValues> = (data) => {
    const newAnnouncement: AnnouncementType = {
      id: `ANN${Date.now()}`,
      title: data.title,
      content: data.content,
      target: data.target === 'all' ? 'All My Classes' : classes.find(c => c.id === data.target)?.name || 'Unknown',
      author: 'Me', // In a real app, this would come from the user session
      date: new Date().toISOString(),
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    toast({
      title: "Announcement Sent!",
      description: `Your message "${data.title}" has been sent.`,
    });
    reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><PlusCircle className="h-6 w-6 text-primary"/>Create New Announcement</CardTitle>
            <CardDescription>Compose a message to be sent to students and parents.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} placeholder="e.g., Upcoming Holiday" />
                {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea id="content" {...register('content')} placeholder="Enter your announcement details here..." rows={5} />
                {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="target">Target Audience</Label>
                     <Controller
                        name="target"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select Class/Group"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All My Classes</SelectItem>
                                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                     {errors.target && <p className="text-destructive text-xs">{errors.target.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label>Notification Channels</Label>
                    <div className="flex items-center space-x-4 pt-2">
                        <Controller
                            name="channels"
                            control={control}
                            render={({ field }) => (
                                <>
                                {notificationChannels.map((item) => (
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
                                        <label htmlFor={item.id} className="text-sm font-medium leading-none">
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                                </>
                            )}
                        />
                    </div>
                    {errors.channels && <p className="text-destructive text-xs mt-1">{errors.channels.message}</p>}
                 </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit"><Send className="mr-2 h-4 w-4" /> Send Announcement</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><Bell className="h-6 w-6 text-primary"/>Sent Announcements</CardTitle>
                <CardDescription>A log of your recent communications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {announcements.map(ann => (
                    <div key={ann.id} className="pb-4 border-b last:border-b-0">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold">{ann.title}</h4>
                            <Badge variant="secondary">{ann.target}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{ann.content.substring(0, 80)}...</p>
                        <p className="text-xs text-muted-foreground mt-2">{format(new Date(ann.date), 'dd MMM, yyyy')} by {ann.author}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
