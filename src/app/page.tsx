'use client';

import { useRouter } from 'next/navigation';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { ArrowRight, Bot, Code2, Eye, LineChart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const FeatureCard = ({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) => (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-start gap-4 transition-all duration-300 transform-gpu hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 group", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/50 to-accent/30 border border-white/20 shadow-lg">
            {icon}
        </div>
        <div className="relative z-10">
            <h3 className="text-lg font-headline font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

const Step = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center md:items-start md:text-left">
    <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary/50 bg-primary/10 text-primary font-bold text-lg font-headline">
      {number}
    </div>
    <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </div>
);

const TrustBadge = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground transition-all duration-300 hover:bg-white/10 hover:shadow-md">
        {children}
    </div>
)

export default function WelcomePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <AppLogo className="h-16 w-16 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
       <div className="absolute top-0 left-0 right-0 -z-10 m-auto h-[410px] w-[410px] rounded-full bg-primary/20 opacity-20 blur-[120px]"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 p-4 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppLogo className="h-8 w-8" />
            <span className="font-headline text-xl font-bold text-white">Craftix AI</span>
          </div>
          <Button variant="ghost" onClick={handleGetStarted}>
            {user ? 'Go to Dashboard' : 'Sign In'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* 1. Hero Section */}
        <section className="py-20 md:py-32 text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-300 to-neutral-500">
                Turn ideas into real apps.
            </h1>
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-primary via-accent to-sky-400 mt-2">
                Powered by AI.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                Craftix AI helps you design, generate, preview, and deploy apps using AI — without friction, without complexity.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" onClick={handleGetStarted}>
                    Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </section>

        {/* 2. Value Highlights */}
        <section className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                    icon={<Bot className="w-6 h-6 text-sky-300" />}
                    title="AI-Powered Builder"
                    description="Describe your idea in plain English. Craftix builds the app."
                    className="bg-gradient-to-br from-sky-950/20 to-background"
                />
                <FeatureCard 
                    icon={<Eye className="w-6 h-6 text-teal-300" />}
                    title="Live Preview"
                    description="See changes instantly as you build in a real-time device preview."
                    className="bg-gradient-to-br from-teal-950/20 to-background"
                />
                <FeatureCard 
                    icon={<Code2 className="w-6 h-6 text-violet-300" />}
                    title="Code + Visual Studio"
                    description="Switch seamlessly between a visual designer and generated code."
                     className="bg-gradient-to-br from-violet-950/20 to-background"
                />
                <FeatureCard 
                    icon={<LineChart className="w-6 h-6 text-orange-300" />}
                    title="Built-in Analytics"
                    description="Understand how your published apps perform with integrated tools."
                    className="bg-gradient-to-br from-orange-950/20 to-background"
                />
            </div>
        </section>

        {/* 3. How It Works */}
        <section className="py-24">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-white">A simple, powerful workflow.</h2>
                <p className="mt-4 max-w-xl mx-auto text-muted-foreground">Go from concept to code in minutes, not months.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                <div className="absolute top-6 left-0 right-0 h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block" />
                <Step number="1" title="Describe Your App" description="Start with a simple text prompt, upload a sketch, or even use your voice." />
                <Step number="2" title="Customize & Refine" description="Use the AI chat and visual editor to tweak the design, logic, and features." />
                <Step number="3" title="Publish & Ship" description="Export production-ready code or deploy directly to the cloud." />
            </div>
        </section>

        {/* 4. Trust & Confidence */}
        <section className="py-16 text-center">
             <h2 className="text-2xl font-headline font-semibold text-white">Built for creators, students, and professionals.</h2>
             <p className="mt-2 text-muted-foreground">No setup headaches. No unnecessary complexity. Scale from idea to production.</p>
             <div className="mt-6 flex justify-center gap-4 flex-wrap">
                <TrustBadge><Zap className="w-4 h-4 text-yellow-400" /> Fast</TrustBadge>
                <TrustBadge><Code2 className="w-4 h-4 text-teal-400" /> Production-ready</TrustBadge>
                <TrustBadge><Bot className="w-4 h-4 text-sky-400" /> AI-Native</TrustBadge>
             </div>
        </section>

        {/* 5. Final CTA */}
        <section className="py-24">
            <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-background to-background border border-primary/40 px-6 py-16 text-center shadow-2xl sm:px-16">
                 <h2 className="text-3xl font-headline font-bold tracking-tight text-white sm:text-4xl">
                    Start building something amazing today.
                 </h2>
                 <p className="mt-3 text-lg text-muted-foreground">
                    Get started for free. No credit card required.
                 </p>
                 <div className="mt-8">
                     <Button size="lg" onClick={handleGetStarted}>
                        Create Your First App
                     </Button>
                 </div>
            </div>
        </section>

      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Craftix AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
