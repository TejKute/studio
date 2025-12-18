'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { format } from 'date-fns';
import type { Project } from '@/types';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectCard({ project }: { project: Project }) {
  const displayDate = project.createdAt
    ? format(new Date(project.createdAt), 'MMM d, yyyy')
    : 'N/A';

  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform-gpu hover:-translate-y-1 hover:shadow-xl bg-card/50 hover:bg-card">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="aspect-video overflow-hidden rounded-md border">
          <Image
            src={project.previewImageUrl || 'https://picsum.photos/seed/placeholder/600/400'}
            alt={`Preview of ${project.name}`}
            width={600}
            height={400}
            className="h-full w-full object-cover"
            data-ai-hint={project.imageHint}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Created {displayDate}</span>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/project/${project.id}`}>
            Open <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProjectGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'projects');
  }, [firestore, user?.uid]);

  const { data: projects, isLoading: areProjectsLoading } = useCollection<Project>(projectsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tighter">
            Build production-ready apps with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Design, generate, preview, and deploy apps from one studio—faster than ever.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
                <Link href="/project/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New App
                </Link>
            </Button>
            <Button size="lg" variant="outline">
                Explore Templates
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-headline font-semibold">Recent Projects</h2>
             <Button variant="ghost" size="sm">
                View All
            </Button>
          </div>
          {areProjectsLoading ? (
             <ProjectGridSkeleton />
          ) : projects && projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-semibold">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first app.</p>
              <Button asChild>
                <Link href="/project/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New App
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
