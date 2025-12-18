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
                  isActive={pathname.startsWith('/search')}
                >
                  <Link href="/search">
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
                  isActive={pathname.startsWith('/templates')}
                >
                  <Link href="/templates">
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
           <div className="p-2">
                <Button size="sm" variant="outline" className="w-full text-xs h-8 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border-sky-500/20 hover:border-sky-500/40 text-sky-400 hover:text-sky-300" asChild>
                    <Link href="/pricing"><Zap className="mr-2 h-3 w-3" /> Coming Soon</Link>
                </Button>
           </div>
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
