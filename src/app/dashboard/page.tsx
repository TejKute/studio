'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowRight } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { mockProjects } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import type { Project } from '@/types';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform-gpu hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="aspect-video overflow-hidden rounded-md border">
          <Image
            src={project.previewImageUrl}
            alt={`Preview of ${project.name}`}
            width={600}
            height={400}
            className="h-full w-full object-cover"
            data-ai-hint={project.imageHint}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Created {format(parseISO(project.createdAt), 'MMM d, yyyy')}</span>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/project/${project.id}`}>
            Open <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold">Welcome, {user.displayName}</h1>
            <p className="text-muted-foreground">Here are your recent projects.</p>
          </div>
          <Button asChild>
            <Link href="/project/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New App
            </Link>
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-headline font-semibold mb-4">Recent Projects</h2>
          {mockProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {mockProjects.map((project) => (
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
