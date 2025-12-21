'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search, ArrowDown, ListFilter, Plus, FolderOpen } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { formatDistanceToNow } from 'date-fns';
import type { Project } from '@/types';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function ProjectCard({ project }: { project: Project }) {
  const displayDate = project.createdAt
    ? formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })
    : 'N/A';

  return (
    <Link href={`/project/${project.id}`} className="block group">
       <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 transform-gpu hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 bg-card/50">
        <CardContent className="p-0">
          <div className="aspect-[4/3] overflow-hidden">
            <Image
              src={project.previewImageUrl || 'https://picsum.photos/seed/placeholder/600/400'}
              alt={`Preview of ${project.name}`}
              width={600}
              height={400}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={project.imageHint}
            />
          </div>
        </CardContent>
        <CardHeader className="flex-grow">
          <CardTitle className="font-headline text-base tracking-tight">{project.name || 'Untitled Project'}</CardTitle>
        </CardHeader>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Edited {displayDate}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}

function CreateProjectCard() {
    return (
        <Link href="/project/new" className="block group">
             <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-transparent p-6 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary hover:bg-primary/5">
                <div className="text-center">
                    <Plus className="mx-auto h-8 w-8" />
                    <p className="mt-2 font-medium">Create New Project</p>
                </div>
            </div>
        </Link>
    );
}

function EmptyState() {
  return (
    <div className="text-center py-16 rounded-lg border-2 border-dashed border-border bg-card/20">
      <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium text-foreground">No projects yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new project.</p>
      <Button asChild className="mt-6">
        <Link href="/project/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Project
        </Link>
      </Button>
    </div>
  );
}


function ProjectGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'projects'), orderBy('createdAt', 'desc'));
  }, [firestore, user?.uid]);

  const { data: projects, isLoading: areProjectsLoading } = useCollection<Project>(projectsQuery);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(project =>
      project.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);


  if (isUserLoading || !user) {
    return (
      <AppLayout>
          <ProjectGridSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between gap-4">
            <div>
                 <h1 className="text-3xl font-headline font-bold">Projects</h1>
                 <p className="text-muted-foreground">Your personal projects are listed here.</p>
            </div>
            <Button size="sm" asChild>
                <Link href="/project/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Project
                </Link>
            </Button>
        </header>

        <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search projects..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="outline" size="sm" className="h-9">
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Last Edited
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Last Edited</DropdownMenuItem>
                        <DropdownMenuItem>Date Created</DropdownMenuItem>
                        <DropdownMenuItem>Name</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="icon" className="h-9 w-9">
                    <ListFilter className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {areProjectsLoading ? (
             <ProjectGridSkeleton />
        ) : filteredProjects && filteredProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <CreateProjectCard />
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
        ) : searchTerm ? (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-border bg-card/20">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No projects found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Your search for "{searchTerm}" did not match any projects.</p>
              <Button variant="outline" className="mt-6" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </div>
        ) : (
             <EmptyState />
        )}
      </div>
    </AppLayout>
  );
}
