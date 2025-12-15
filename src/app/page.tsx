'use client';

import { useRouter } from 'next/navigation';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';

export default function WelcomePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black">
        <AppLogo className="h-16 w-16 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center bg-background p-4 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

      <div className="flex flex-col items-center text-center">
        <AppLogo className="h-16 w-16" />
        <h1 className="mt-6 text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Craftify AI
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Create Flutter apps with the power of AI
        </p>
        <Button size="lg" className="mt-8" onClick={() => router.push('/login')}>
          Get Started
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          <a href="#" className="underline hover:text-foreground">Learn how it works</a>
        </p>
      </div>
    </div>
  );
}
