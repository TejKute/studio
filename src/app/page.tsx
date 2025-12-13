import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Bot, KeyRound, LayoutDashboard, FolderKanban, Smartphone, Download, Settings, Rocket } from 'lucide-react';
import AppLogo from '@/components/app-logo';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered App Generation',
    description: 'Generate Flutter app code from a simple text description.',
  },
  {
    icon: <KeyRound className="h-8 w-8 text-primary" />,
    title: 'Secure Authentication',
    description: 'User authentication with Firebase (Google & Email).',
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: 'Centralized Dashboard',
    description: 'Manage your projects, create new apps, and access your account.',
  },
  {
    icon: <FolderKanban className="h-8 w-8 text-primary" />,
    title: 'Project Management',
    description: 'Create and store your Flutter projects, including descriptions and themes.',
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: 'Live Code Preview',
    description: 'See a live preview of your generated app\'s UI and navigation.',
  },
  {
    icon: <Download className="h-8 w-8 text-primary" />,
    title: 'Code Export',
    description: 'Download your generated Flutter code as a complete project ZIP file.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <AppLogo className="h-8 w-8" />
            <span className="font-bold font-headline text-lg">Craftify AI</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="container mx-auto text-center px-4 md:px-6">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Build Flutter Apps with the Power of AI
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Craftify AI turns your ideas into functional Flutter applications. Just describe what you want, and let our AI handle the code.
            </p>
            <div className="mt-6">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start Building for Free
                  <Rocket className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Go from Idea to App
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From generation and preview to project management and export, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-6 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
             <AppLogo className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Craftify AI. All rights reserved.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
