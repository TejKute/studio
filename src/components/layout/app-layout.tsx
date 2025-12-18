'use client';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { LayoutDashboard, Settings, PlusCircle, LogOut, Code, Home, Search, Folder, FileCode, Users, LifeBuoy, Zap, Star } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { UserNav } from '@/components/user-nav';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Card, CardContent } from '../ui/card';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  if (pathname.startsWith('/project/')) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <AppLogo className="w-8 h-8 text-primary" />
            <h1 className="font-headline text-xl font-bold">Craftify AI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/dashboard')}
                tooltip="Home"
              >
                <Link href="/dashboard">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Search"
                >
                  <Link href="#">
                    <Search />
                    <span>Search</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/project')}
                tooltip="All Projects"
              >
                <Link href="/dashboard">
                  <Folder />
                  <span>All Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Templates"
                >
                  <Link href="#">
                    <FileCode />
                    <span>Templates</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/settings')}
                tooltip="Settings"
              >
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Shared with me"
                >
                  <Link href="#">
                    <Users />
                    <span>Shared with me</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
           <Card className="m-2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardContent className="p-4 text-center">
                  <h3 className="font-headline text-sm font-semibold">Upgrade to Pro</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Unlock unlimited generations and advanced features.</p>
                  <Button size="sm" className="w-full" asChild>
                      <Link href="/pricing"><Zap className="mr-2 h-4 w-4" /> Upgrade</Link>
                  </Button>
              </CardContent>
           </Card>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="What's New"
                >
                  <Link href="#">
                    <Star />
                    <span>What’s New</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1" />
                <UserNav />
            </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
