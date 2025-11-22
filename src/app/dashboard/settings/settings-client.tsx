
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function SettingsClient() {
    const { toast } = useToast();
    const { user, loading, updateUserProfile, changeUserPassword, reauthenticate } = useCurrentUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
    });
    
    const [isReauthDialogOpen, setIsReauthDialogOpen] = useState(false);
    const [reauthPassword, setReauthPassword] = useState('');
    const [reauthError, setReauthError] = useState<string | null>(null);
    const [isReauthLoading, setIsReauthLoading] = useState(false);
    
    const [passwordAction, setPasswordAction] = useState<(() => Promise<void>) | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setEmail(user.email || '');
            setAvatar(user.photoURL || 'https://picsum.photos/seed/1/100/100');
        }
    }, [user]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        if (!user) return;
        setIsProfileLoading(true);
        try {
            // In a real app, you'd upload avatarFile to storage here and get a URL
            await updateUserProfile({ displayName: name });
            toast({
                title: "Settings Saved",
                description: "Your profile information has been updated.",
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: error.message,
            });
        } finally {
            setIsProfileLoading(false);
        }
    };
    
    const handleChangePasswordAttempt = async () => {
      setPasswordError(null);
      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
        return;
      }
      
      const action = async () => {
        try {
          await changeUserPassword(newPassword);
          toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
          });
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } catch (error: any) {
           setPasswordError(error.message);
        }
      };

      setPasswordAction(() => action);
      setIsReauthDialogOpen(true);
    };

    const handleReauthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reauthPassword) {
            setReauthError("Please enter your current password.");
            return;
        }
        setIsReauthLoading(true);
        setReauthError(null);
        try {
            await reauthenticate(reauthPassword);
            setIsReauthDialogOpen(false);
            setReauthPassword('');
            if (passwordAction) {
                await passwordAction();
            }
        } catch (error: any) {
            setReauthError("Incorrect password. Please try again.");
        } finally {
            setIsReauthLoading(false);
            setPasswordAction(null);
        }
    };

    if (loading) {
        return <SettingsSkeleton />
    }

    return (
        <>
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={avatar} alt={name} data-ai-hint="person portrait"/>
                                <AvatarFallback>{name ? name.substring(0,2).toUpperCase() : '...'}</AvatarFallback>
                            </Avatar>
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                            />
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
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
                                <Input id="email" type="email" value={email} disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveChanges} disabled={isProfileLoading}>
                                {isProfileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>For your security, we recommend using a strong password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {passwordError && (
                                <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{passwordError}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleChangePasswordAttempt} disabled={isPasswordLoading}>
                                {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
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
                            <Button onClick={() => toast({ title: "Preferences saved!" })}>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Dialog open={isReauthDialogOpen} onOpenChange={setIsReauthDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Your Identity</DialogTitle>
                        <DialogDescription>
                            For your security, please enter your current password to make this change.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReauthSubmit}>
                        <div className="space-y-4 py-4">
                            {reauthError && (
                                <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Authentication Failed</AlertTitle>
                                <AlertDescription>{reauthError}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="reauth-password">Current Password</Label>
                                <Input 
                                    id="reauth-password"
                                    type="password" 
                                    value={reauthPassword}
                                    onChange={(e) => setReauthPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsReauthDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isReauthLoading}>
                                {isReauthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}


const SettingsSkeleton = () => (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-28" />
                </CardFooter>
            </Card>
        </div>
    </div>
)
