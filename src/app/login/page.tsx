'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/app-logo';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { Mail } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!auth) return;

    setIsSigningIn(true);
    setAuthError(null);

    const provider = new GoogleAuthProvider();

    try {
      // The user will be redirected to the dashboard by a different mechanism
      // after a successful sign-in. This page's only job is to initiate it.
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        // Fallback to redirect for environments where popups are blocked.
        await signInWithRedirect(auth, provider);
      } else if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Google Sign-In is not enabled. Please enable it in the Firebase console.');
      } else {
        console.error('Google Sign-In Error:', error);
        setAuthError('Google sign-in failed. Please try again.');
      }
      setIsSigningIn(false);
    }
  };

  const AppleIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.22,6.15a3.81,3.81,0,0,0-2.43.9,3.69,3.69,0,0,0-1.12,2.5,4.41,4.41,0,0,0,.11,1,4.19,4.19,0,0,0,2-2.31,1.43,1.43,0,0,1,1.2-.74A1.3,1.3,0,0,1,15.22,6.15Zm8.58,10.7a4.34,4.34,0,0,1-1.6,3.31,4.2,4.2,0,0,1-2.61,1.15,2.58,2.58,0,0,1-1.39-.39,2.44,2.44,0,0,1-1-1.5,4.71,4.71,0,0,1,.87-3,4.1,4.1,0,0,1,2.58-1.59,2.53,2.53,0,0,1,1.39.39,2.4,2.4,0,0,1,1,1.54,5.4,5.4,0,0,1-.08,1.06c0,.07,0,.13,0,.2Zm-6.52-5a4.31,4.31,0,0,1,2.69-1.63,4.32,4.32,0,0,1,3,1A4.14,4.14,0,0,1,23.36,15a4.13,4.13,0,0,1-1.18,2.94,4.2,4.2,0,0,1-3,1.35A4.3,4.3,0,0,1,16.5,18a4.06,4.06,0,0,1-1.2-2.89A4.14,4.14,0,0,1,16,12.22a4.42,4.42,0,0,1,1.28-.36M15.4,1.42A4.2,4.2,0,0,1,18.33.13a4.31,4.31,0,0,1,2.68,1.6,4.19,4.19,0,0,1,0,4.88,4.29,4.29,0,0,1-2.68,1.61,4.2,4.2,0,0,1-3.06-1,4.16,4.16,0,0,1-1.15-3.08A4.13,4.13,0,0,1,15.4,1.42M10.23,23.82a2.48,2.48,0,0,1,1.39.38,2.53,2.53,0,0,1,1-1.55,4.64,4.64,0,0,1-.87-3,4.1,4.1,0,0,1-2.58-1.59,2.53,2.53,0,0,1-1.39.39,2.4,2.4,0,0,1-1,1.54,5.4,5.4,0,0,1,.08,1.06,4.34,4.34,0,0,1,1.6,3.31A4.2,4.2,0,0,1,10.23,23.82ZM.2,16.85A4.34,4.34,0,0,1,1.8,13.54a4.2,4.2,0,0,1,2.61-1.15,2.58,2.58,0,0,1,1.39.39,2.44,2.44,0,0,1,1,1.5,4.71,4.71,0,0,1-.87,3A4.1,4.1,0,0,1,3.35,19.8,2.53,2.53,0,0,1,1.95,19.4a2.4,2.4,0,0,1-1-1.54A5.4,5.4,0,0,1,.84,17.8,4.5,4.5,0,0,1,.2,16.85ZM12.78.36A4.42,4.42,0,0,1,14,12.22a4.14,4.14,0,0,1-.7,2.67,4.13,4.13,0,0,1-2.94,1.18,4.3,4.3,0,0,1-2.69-1.63,4.32,4.32,0,0,1-3-1A4.14,4.14,0,0,1,1.64,10.5,4.13,4.13,0,0,1,2.82,7.56a4.2,4.2,0,0,1,3-1.35,4.3,4.3,0,0,1,2.69,1.63,4.32,4.32,0,0,1,3,1A4.14,4.14,0,0,1,12.78.36Zm-3-1a4.2,4.2,0,0,0-3.06,1A4.16,4.16,0,0,0,5.54,3.48,4.13,4.13,0,0,0,4.29,6.4,4.2,4.2,0,0,0,7.22,7.69a4.31,4.31,0,0,0,2.68-1.6A4.19,4.19,0,0,0,9.87,1.21,4.29,4.29,0,0,0,7.22-.4,4.2,4.2,0,0,0,9.75-.64Z"/>
    </svg>
  );

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
          <Button size="lg" className="w-full bg-white text-black hover:bg-white/90" onClick={handleGoogleSignIn} disabled={isSigningIn}>
            {isSigningIn ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
            )}
            Continue with Google
          </Button>

           <Button size="lg" className="w-full bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800" disabled={isSigningIn}>
              <AppleIcon />
              Continue with Apple
           </Button>

            <Button size="lg" variant="outline" className="w-full" disabled={isSigningIn}>
              <Mail className="mr-2 h-4 w-4" />
              Continue with Email
            </Button>
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
