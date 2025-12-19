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
          <Button size="lg" className="w-full gap-2 bg-white text-black hover:bg-gray-100 border border-gray-200" onClick={() => handleOAuthSignIn('apple')} disabled={isSigningIn}>
              <svg
                height="18"
                width="18"
                viewBox="0 0 24 24"
                fill="#000000"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
              >
                  <path d="M16.365 1.43c0 1.14-.463 2.257-1.282 3.112-.827.86-2.183 1.53-3.34 1.44-.14-1.125.457-2.31 1.236-3.15.78-.86 2.14-1.48 3.386-1.402zM20.447 17.34c-.59 1.32-.86 1.91-1.62 3.09-1.07 1.66-2.58 3.72-4.45 3.74-1.66.02-2.08-1.09-4.32-1.09-2.24 0-2.7 1.07-4.32 1.11-1.87.04-3.3-1.9-4.37-3.55-2.44-3.76-2.7-8.17-1.19-10.47 1.07-1.63 2.77-2.58 4.32-2.58 1.7 0 2.77 1.11 4.32 1.11 1.5 0 2.42-1.11 4.3-1.11 1.38 0 2.84.76 3.9 2.07-3.42 1.87-2.87 6.73 1.41 8.68z"/>
              </svg>
            Continue with Apple
          </Button>

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
