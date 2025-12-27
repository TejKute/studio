'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/app-logo';
import { useAuth, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';


const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function EmailLoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleAuthError = (error: any) => {
    setIsSubmitting(false);
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        setAuthError('Invalid email or password. Please try again.');
        break;
      case 'auth/email-already-in-use':
        setAuthError('An account with this email already exists. Please sign in.');
        setAuthMode('signin');
        break;
      case 'auth/invalid-email':
        setAuthError('Please enter a valid email address.');
        break;
      case 'auth/weak-password':
        setAuthError('The password is too weak. Please use at least 6 characters.');
        break;
      default:
        setAuthError('An unexpected error occurred. Please try again.');
        console.error('Email Auth Error:', error);
        break;
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    if (!auth) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      if (authMode === 'signin') {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      }
      // On success, the `useEffect` hook will redirect to the dashboard.
    } catch (error) {
      handleAuthError(error);
    }
  };

  if (isUserLoading || user) {
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
         <AppLogo className="h-12 w-12 animate-pulse" />
       </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
            <AppLogo className="h-12 w-12 mb-4 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-white">
              {authMode === 'signin' ? 'Sign In with Email' : 'Create an Account'}
            </h1>
            <p className="mt-1 text-md text-muted-foreground">
              {authMode === 'signin' 
                ? "Enter your credentials to access your account." 
                : "Fill out the form to get started."
              }
            </p>
        </div>
          
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {authError && (
                  <p className="text-sm text-center text-red-400">{authError}</p>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(null); }} className="font-medium text-primary hover:underline">
            {authMode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

         <p className="mt-2 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            &larr; Back to all sign-in options
          </Link>
        </p>
      </div>
    </div>
  );
}
