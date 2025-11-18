
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SettingsClient() {
    const { toast } = useToast();

    // Mock user data - in a real app this would come from a context or hook
    const [user, setUser] = useState({
        name: 'Alex Doe',
        email: 'alex.doe@example.com',
        avatar: 'https://picsum.photos/seed/1/100/100',
        notifications: {
            email: true,
            push: false,
        }
    });
    
    const [name, setName] = useState(user.name);
    const [notifications, setNotifications] = useState(user.notifications);

    const handleSaveChanges = () => {
        // In a real app, you would make an API call here
        toast({
            title: "Settings Saved",
            description: "Your profile information has been updated.",
        });
    };
    
    const handleChangePassword = () => {
        // In a real app, you would make an API call here
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
        });
    };

    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait"/>
                            <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Change Photo
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2 space-y-8">
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={user.email} disabled />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </CardFooter>
                </Card>

                 <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>For your security, we recommend using a strong password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleChangePassword}>Update Password</Button>
                    </CardFooter>
                </Card>

                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                        <CardDescription>Manage how you receive notifications from us.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h3 className="font-medium">Email Notifications</h3>
                                <p className="text-sm text-muted-foreground">Receive updates and announcements via email.</p>
                            </div>
                            <Switch
                                checked={notifications.email}
                                onCheckedChange={(checked) => setNotifications(prev => ({...prev, email: checked}))}
                            />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h3 className="font-medium">Push Notifications</h3>
                                <p className="text-sm text-muted-foreground">Get real-time alerts on your devices.</p>
                            </div>
                            <Switch
                                checked={notifications.push}
                                onCheckedChange={(checked) => setNotifications(prev => ({...prev, push: checked}))}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveChanges}>Save Preferences</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
