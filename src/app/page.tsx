'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/app-logo';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useUser } from '@/firebase/provider';

export default function WelcomePage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (auth) {
      setIsSigningIn(true);
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        // On success, the onAuthStateChanged listener will redirect to the dashboard
      } catch (error: any) {
        // Handle common errors, like popup blocked
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
          // Fallback to redirect method
          await signInWithRedirect(auth, provider);
        } else if (error.code === 'auth/operation-not-allowed') {
          setAuthError('Google Sign-In is not enabled. Please enable it in the Firebase console.');
        } else {
          console.error('Google Sign-In Error:', error);
          setAuthError('Google sign-in failed. Please try again.');
        }
        setIsSigningIn(false);
      }
    }
  };

  if (isUserLoading || user) {
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-black">
        <AppLogo className="h-16 w-16 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
       <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
       <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

      <div className="flex flex-col items-center text-center">
        <AppLogo className="h-16 w-16" />
        <h1 className="mt-6 text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Craftify AI
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Create Flutter apps using AI
        </p>
        <Button size="lg" className="mt-8" onClick={handleGoogleSignIn} disabled={isSigningIn}>
          {isSigningIn ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
          )}
          {isSigningIn ? 'Signing In...' : 'Continue with Google'}
        </Button>
        {authError && (
          <p className="mt-4 text-sm text-red-400">{authError}</p>
        )}
      </div>
    </div>
  );
}
