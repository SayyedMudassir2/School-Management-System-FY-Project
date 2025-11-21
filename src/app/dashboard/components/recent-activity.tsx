
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  { user: "Mr. John Smith", action: "updated the timetable for Class 10.", time: "2m ago", avatar: "https://picsum.photos/seed/teacher/100/100", fallback: "JS" },
  { user: "Alice Johnson", action: "submitted her fee payment.", time: "1h ago", avatar: "https://picsum.photos/seed/student1/100/100", fallback: "AJ" },
  { user: "Admin", action: "posted a new announcement.", time: "3h ago", avatar: "https://picsum.photos/seed/admin/100/100", fallback: "AD" },
  { user: "Ms. Emily White", action: "graded the Science test for Class 9.", time: "5h ago", avatar: "https://picsum.photos/seed/teacher2/100/100", fallback: "EW" },
];

export function RecentActivity() {
  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>What's been happening across the school.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>{activity.fallback}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
