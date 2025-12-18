'use client';
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function ProfileCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}


export default function SettingsPage() {
  const { user, isUserLoading } = useUser();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        <Separator />

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            {isUserLoading ? (
              <ProfileCardSkeleton />
            ) : user ? (
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                          <AvatarImage src={user.photoURL ?? ''} data-ai-hint="person portrait" />
                          <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">Change Photo</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.displayName ?? ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email ?? ''} disabled />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            ) : (
               <ProfileCardSkeleton />
            )}

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Choose what you want to be notified about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">App Generation Complete</h3>
                    <p className="text-sm text-muted-foreground">Receive an email when your app code is ready.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Promotional Emails</h3>
                    <p className="text-sm text-muted-foreground">Get updates about new features and offers.</p>
                  </div>
                  <Switch />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Security Alerts</h3>
                    <p className="text-sm text-muted-foreground">Be notified about important security events.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Your usage for the current billing cycle.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <p>App Generations</p>
                        <p>
                            <span className="font-medium">0</span> / 3
                        </p>
                    </div>
                     <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground">Part of your Free plan.</p>
                <Separator />
                <Button className="w-full" asChild>
                  <Link href="/pricing">
                    Upgrade Plan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
