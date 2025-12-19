'use client';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { LayoutDashboard, Settings, LogOut, Home, Search, Folder, Star, Lock, Zap } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { UserNav } from '@/components/user-nav';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

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
                isActive={pathname.startsWith('/settings')}
                tooltip="Settings"
              >
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4 space-y-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/10 to-sky-500/10 border border-violet-500/20 text-center">
                <div className='flex items-center justify-center gap-2'>
                  <Zap className="h-4 w-4 text-violet-300" />
                  <h4 className="font-semibold text-sm text-white">Upgrade to Pro</h4>
                </div>
                <Button size="sm" className="w-full mt-2 h-7 text-xs bg-white/10 hover:bg-white/20 text-white" disabled>
                    Coming Soon
                </Button>
            </div>
             <Button variant="outline" size="sm" className="w-full h-8 border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300">
                <Star className="mr-2 h-3 w-3" /> What's New
            </Button>
          </div>
          <SidebarSeparator />
           <div className="p-2">
                 <p className="text-xs text-center text-muted-foreground mb-2">High-quality starter templates are on the way.</p>
           </div>
          <SidebarMenu>
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
