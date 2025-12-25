'use client';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { LayoutDashboard, Settings, LogOut, Home, Search, Folder, Star } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { UserNav } from '@/components/user-nav';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { ProjectSearchModal } from '@/components/project-search-modal';
import React from 'react';
import { WhatsNewPanel } from '@/components/whats-new-panel';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = React.useState(false);

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
            <AppLogo className="w-8 h-8" />
            <h1 className="font-headline text-xl font-bold text-white">Craftix AI</h1>
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
                  onClick={() => setIsSearchOpen(true)}
                  tooltip="Search"
                >
                    <Search />
                    <span>Search</span>
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
             <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border border-border text-center">
                <h4 className="font-semibold text-sm text-white">Upgrade to Pro</h4>
                <p className="text-xs text-muted-foreground mt-1">Advanced features are coming soon.</p>
                <Button size="sm" disabled className="w-full mt-2 h-8 text-xs bg-primary/20 hover:bg-primary/30">Coming Soon</Button>
            </div>
             <Button variant="outline" size="sm" className="w-full h-8 border-border hover:bg-accent/50 text-foreground" onClick={() => setIsWhatsNewOpen(true)}>
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
      <ProjectSearchModal isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <WhatsNewPanel isOpen={isWhatsNewOpen} onOpenChange={setIsWhatsNewOpen} />
    </SidebarProvider>
  );
}
