'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/app-logo';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { Mail } from 'lucide-react';
import { AppleLogo } from '@/components/icons/AppleLogo';
import Link from 'next/link';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;

    setIsSigningIn('google');
    setAuthError(null);

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      // On successful sign-in, the onAuthStateChanged listener in FirebaseProvider
      // will handle the user state and the useEffect hook above will redirect.
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        try {
            await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
             console.error('Google Sign-In Redirect Error:', redirectError);
             setAuthError('Google sign-in failed. Please try again.');
        }
      } else if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Google Sign-In is not enabled. Please enable it in the Firebase console.');
      } else {
        console.error('Google Sign-In Error:', error);
        setAuthError('Google sign-in failed. Please try again.');
      }
      setIsSigningIn(null);
    }
  };

  const handleAppleSignIn = async () => {
    if (!auth) return;

    setIsSigningIn('apple');
    setAuthError(null);

    const provider = new OAuthProvider('apple.com');

    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        try {
            await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
             console.error('Apple Sign-In Redirect Error:', redirectError);
             setAuthError('Apple sign-in failed. Please try again.');
        }
      } else if (error.code === 'auth/operation-not-allowed') {
        setAuthError('Apple Sign-In is not enabled. Please enable it in the Firebase console.');
      } else {
        console.error('Apple Sign-In Error:', error);
        setAuthError('Apple sign-in failed. Please try again.');
      }
      setIsSigningIn(null);
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
            <h1 className="text-3xl font-headline font-bold text-white">Welcome to Craftix AI</h1>
            <p className="mt-1 text-md text-muted-foreground">Sign in to start building with AI</p>
        </div>
          
        <div className="space-y-3">
          <button className="auth-btn" onClick={handleGoogleSignIn} disabled={!!isSigningIn}>
            <span className="auth-icon">
              {isSigningIn === 'google' ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
              )}
            </span>
            <span>Continue with Google</span>
          </button>

          <button className="auth-btn" onClick={handleAppleSignIn} disabled={!!isSigningIn}>
            <span className="auth-icon">
              <AppleLogo />
            </span>
            <span>Continue with Apple</span>
          </button>

          <Link href="/login/email" className="auth-btn" aria-disabled={!!isSigningIn}>
            <span className="auth-icon">
              <Mail size={18} strokeWidth={1.8} />
            </span>
            <span>Continue with Email</span>
          </Link>
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
