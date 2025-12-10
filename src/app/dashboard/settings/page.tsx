'use client';

import { ThemeToggle } from '@/components/dashboard/settings/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteAccount } from '@/lib/delete-account';

export default function SettingsPage() {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
      <p className="text-muted-foreground mt-2">Manage your account and application settings.</p>
      <div className="mt-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="font-medium">Theme</p>
              <ThemeToggle />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Select between light and dark mode.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="font-medium">Delete Account</p>
              <Button variant="destructive" onClick={deleteAccount}>Delete Account</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Permanently delete your account and all of your data. This action cannot be undone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
