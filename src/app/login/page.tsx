'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/app-logo';
import { useAuth, useUser } from '@/firebase';
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleOAuthSignIn = async (providerName: 'google' | 'apple') => {
    if (!auth) return;

    setIsSigningIn(true);
    setAuthError(null);
    
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple.com');

    try {
      await signInWithPopup(auth, provider);
      // On success, the onAuthStateChanged listener will redirect to the dashboard
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, provider);
      } else if (error.code === 'auth/operation-not-allowed') {
        setAuthError(`${providerName.charAt(0).toUpperCase() + providerName.slice(1)} Sign-In is not enabled. Please enable it in the Firebase console.`);
      } else {
        console.error(`${providerName} Sign-In Error:`, error);
        setAuthError(`${providerName.charAt(0).toUpperCase() + providerName.slice(1)} sign-in failed. Please try again.`);
      }
      setIsSigningIn(false);
    }
  };

  const handleEmailAuth = async (values: z.infer<typeof formSchema>) => {
    if (!auth) return;

    setIsSigningIn(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const methods = await fetchSignInMethodsForEmail(auth, values.email);
        if (methods.length > 0) {
          setAuthError('An account with this email already exists. Please log in.');
          setIsSigningIn(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      }
      // On success, the onAuthStateChanged listener will redirect
    } catch (error: any) {
      console.error('Email Auth Error:', error);
      if (error.code === 'auth/wrong-password') {
        setAuthError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setAuthError('No account found with this email. Please sign up.');
      } else if (error.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists. Please log in.');
      } else {
        setAuthError('An error occurred. Please try again.');
      }
      setIsSigningIn(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <AppLogo className="h-16 w-16 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
            <AppLogo className="h-12 w-12 mb-4 text-primary" />
            <h1 className="text-3xl font-headline font-bold text-white">Welcome to Craftify AI</h1>
            <p className="mt-1 text-md text-muted-foreground">Sign in to start building with AI</p>
        </div>

        <div className="space-y-4">
          <Button size="lg" className="w-full bg-white text-black hover:bg-white/90" onClick={() => handleOAuthSignIn('google')} disabled={isSigningIn}>
            {isSigningIn ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
            )}
            Continue with Google
          </Button>
          <Button size="lg" className="w-full bg-white text-black hover:bg-white/90" onClick={() => handleOAuthSignIn('apple')} disabled={isSigningIn}>
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01,2.02c-1.33-0.03-2.67,0.44-3.79,1.39c-1.2,1.01-2.11,2.44-2.43,4.05c-0.09,0.47,0.24,0.91,0.72,0.99 c0.48,0.08,0.92-0.24,1-0.71c0.03-0.18,0.06-0.35,0.1-0.52c0.47-1.2,1.57-2.01,2.9-2.21c1.33-0.2,2.7,0.09,3.73,0.9 c0.13,0.1,0.25,0.22,0.36,0.34c-1.58,0.94-2.58,2.67-2.55,4.52c0.03,2.01,1.2,3.8,2.94,4.64c0.23,0.11,0.47,0.21,0.71,0.29 c-0.25,0.44-0.52,0.86-0.81,1.26c-0.79,1.08-1.74,2.03-2.92,2.66c-1.2,0.64-2.58,0.9-3.93,0.75c-1.4-0.15-2.73-0.72-3.8-1.62 c-0.4-0.33-0.97-0.23-1.3,0.18c-0.33,0.4,-0.22,0.97,0.18,1.3c1.3,1.1,2.89,1.8,4.59,2.01c1.7,0.21,3.45-0.02,5.06-0.69 c1.58-0.66,2.98-1.76,4.05-3.18c0.05-0.07,0.1-0.14,0.15-0.21c-0.1,0.02-0.19,0.04-0.28,0.05c-1.5,0.17-3.04-0.65-3.86-1.92 c-0.57-0.88-0.8-1.93-0.64-2.98c0.15-1.05,0.7-2.02,1.52-2.75c0.55-0.49,1.2-0.86,1.9-1.09C17.2,12,17.91,12,18.6,12.2 c0.04,0.01,0.08,0.02,0.12,0.04c-0.08-0.44-0.22-0.86-0.43-1.25c-0.86-1.58-2.33-2.7-4.1-3.08C13.51,7.77,12.76,7.8,12.01,8.02z M17.06,11.02c-0.29-0.02-0.58-0.02-0.86,0.02c-1.23,0.17-2.28,0.89-2.86,1.96c-0.54,1.01-0.67,2.2-0.34,3.31 c0.33,1.11,1.13,2.01,2.21,2.48c1.08,0.47,2.3,0.43,3.35-0.12c1.05-0.55,1.82-1.53,2.15-2.67c0.01-0.05,0.02-0.09,0.03-0.14 c-1.08,0.14-2.18-0.22-2.9-0.96c-0.72-0.74-1.08-1.76-0.97-2.81c0.05-0.46-0.28-0.88-0.74-0.95C17.11,11.04,17.08,11.03,17.06,11.02z"></path></svg>
            Continue with Apple
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          <Button size="lg" className="w-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800" onClick={() => setShowEmailForm(!showEmailForm)} disabled={isSigningIn}>
            Continue with Email
          </Button>

          {showEmailForm && (
            <div className="p-4 border rounded-lg bg-zinc-900/50 border-zinc-800">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailAuth)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-400">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} className="bg-zinc-900 border-zinc-700 text-white focus:ring-primary" />
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
                        <FormLabel className="text-zinc-400">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-zinc-900 border-zinc-700 text-white focus:ring-primary"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isSigningIn}>
                    {isSigningIn ? 'Processing...' : (authMode === 'signup' ? 'Sign Up' : 'Sign In')}
                  </Button>
                </form>
              </Form>
              <Button variant="link" size="sm" className="mt-2 text-muted-foreground" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </Button>
            </div>
          )}

        </div>
        
        {authError && (
          <p className="mt-4 text-sm text-center text-red-400">{authError}</p>
        )}

        <p className="px-8 text-center text-sm text-muted-foreground mt-8">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
