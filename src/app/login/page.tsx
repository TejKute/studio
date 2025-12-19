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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
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
          <Button size="lg" className="w-full bg-black text-white hover:bg-black/90 border border-transparent hover:border-white/20" onClick={() => handleOAuthSignIn('apple')} disabled={isSigningIn}>
            <svg viewBox="0 0 24 24" className="mr-3 h-5 w-5" fill="currentColor">
              <path d="M14.22,6.15a2.1,2.1,0,0,0-2.45-1.12,2.06,2.06,0,0,0-1.5,1.21,5.8,5.8,0,0,0-1,3.56,5.43,5.43,0,0,0,1.21,3.75,2.1,2.1,0,0,0,1.52,1,2.06,2.06,0,0,0,2.21-1.2,0.18,0.18,0,0,1,.36-0.08c0.36,1.2,1.3,1.93,2.4,1.93,0.3,0,0.6-0.07,0.89-0.2a0.22,0.22,0,0,0,.14-0.24,0.19,0.19,0,0,0-.2-0.15,2.5,2.5,0,0,1-1-.18,1.92,1.92,0,0,1-1.28-2,5.18,5.18,0,0,1,1.18-3.64A2.39,2.39,0,0,0,14.22,6.15Zm-2.58,6.11a1.44,1.44,0,0,1-1-1.55,1.47,1.47,0,0,1,1.08-1.55,1.51,1.51,0,0,1,1.7,1,1.5,1.5,0,0,1-1.1,2.06,0.2,0.2,0,0,1-.54,0,0.12,0.12,0,0,1-.18,0Zm9-8.49a6.2,6.2,0,0,0-5.1,2.69,5.85,5.85,0,0,0-1.58,4.2,5.55,5.55,0,0,0,1.73,4.3,6.34,6.34,0,0,0,5.2,2.44A6.16,6.16,0,0,0,21.84,15a0.2,0.2,0,0,0-.16-0.34,0.19,0.19,0,0,0-.2.12,5.53,5.53,0,0,1-4.71,2.13,5.65,5.65,0,0,1-4.59-2.18,4.86,4.86,0,0,1-1.53-3.8,5.23,5.23,0,0,1,1.4-3.76,5.48,5.48,0,0,1,4.46-2.42,5.34,5.34,0,0,1,3.4,1.29,0.2,0.2,0,0,0,.28,0l0.1-0.18a0.2,0.2,0,0,0,0-.28A6.1,6.1,0,0,0,20.61,3.77Z"></path>
            </svg>
            Continue with Apple
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          <Button size="lg" className="w-full bg-secondary/50 border border-border text-foreground hover:bg-secondary" onClick={() => setShowEmailForm(!showEmailForm)} disabled={isSigningIn}>
            Continue with Email
          </Button>

          {showEmailForm && (
            <div className="p-4 border rounded-lg bg-secondary/20 border-border">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailAuth)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-400">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} className="bg-background/80 border-border text-white focus:ring-primary" />
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
                          <Input type="password" placeholder="••••••••" {...field} className="bg-background/80 border-border text-white focus:ring-primary"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSigningIn}>
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
