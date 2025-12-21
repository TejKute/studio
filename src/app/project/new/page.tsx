'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import AppLogo from '@/components/app-logo';

const projectSchema = z.object({
  projectName: z
    .string()
    .min(3, 'Project name must be at least 3 characters long.')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Project name can only contain letters, numbers, spaces, and hyphens.'),
  projectType: z.string({
    required_error: 'Please select a project type.',
  }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    try {
      const projectsCollection = collection(firestore, 'users', user.uid, 'projects');
      const newProjectDoc = await addDoc(projectsCollection, {
        name: data.projectName,
        projectType: data.projectType,
        description: `A new ${data.projectType} project named ${data.projectName}`,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      
      router.push(`/project/${newProjectDoc.id}`);

    } catch (error) {
      console.error('Error creating project:', error);
      // Here you could show a toast notification
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      
      <div className="flex flex-col items-center text-center mb-8">
        <AppLogo className="h-12 w-12 mb-4 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-white">Create a New Project</h1>
        <p className="mt-1 text-md text-muted-foreground">Let's get started on your next big idea.</p>
      </div>

      <Card className="w-full max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Give your new project a name and type.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome App" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flutter_all">Flutter (Android + iOS + Web)</SelectItem>
                        <SelectItem value="android_only">Android only</SelectItem>
                        <SelectItem value="ios_only">iOS only</SelectItem>
                        <SelectItem value="web_only">Web only</SelectItem>
                        <SelectItem value="flutter_mobile">Flutter Mobile (Android + iOS)</SelectItem>
                        <SelectItem value="flutter_web">Flutter Web only</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
