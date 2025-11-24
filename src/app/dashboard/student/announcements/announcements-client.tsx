
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Bell, School, Users } from 'lucide-react';

type Announcement = {
    id: string;
    title: string;
    content: string;
    type: 'School' | 'Class';
    date: string;
};

type AnnouncementsClientProps = {
  initialAnnouncements: Announcement[];
};

export function AnnouncementsClient({ initialAnnouncements }: AnnouncementsClientProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const { school, class: classSpecific } = useMemo(() => {
    return announcements.reduce((acc, announcement) => {
        if (announcement.type === 'School') {
            acc.school.push(announcement);
        } else {
            acc.class.push(announcement);
        }
        return acc;
    }, { school: [] as Announcement[], class: [] as Announcement[] });
  }, [announcements]);

  const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => (
    <Card className="glassmorphic hover:bg-muted/30 transition-colors">
        <CardHeader>
            <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <Badge variant={announcement.type === 'School' ? 'default' : 'secondary'}>
                    {announcement.type}
                </Badge>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
                {format(new Date(announcement.date), 'dd MMM, yyyy')}
            </p>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">{announcement.content}</p>
        </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all"><Bell className="mr-2 h-4 w-4"/>All</TabsTrigger>
            <TabsTrigger value="school"><School className="mr-2 h-4 w-4"/>School-wide</TabsTrigger>
            <TabsTrigger value="class"><Users className="mr-2 h-4 w-4"/>Class Specific</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
                {announcements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
            </div>
        </TabsContent>
        <TabsContent value="school" className="mt-4">
             <div className="space-y-4">
                {school.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
            </div>
        </TabsContent>
        <TabsContent value="class" className="mt-4">
             <div className="space-y-4">
                {classSpecific.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
            </div>
        </TabsContent>
    </Tabs>
  );
}
