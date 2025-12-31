'use client';

import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Project } from '@/types';
import { collection, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { File } from 'lucide-react';

interface ProjectSearchModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProjectSearchModal({ isOpen, onOpenChange }: ProjectSearchModalProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'projects');
  }, [firestore, user?.uid]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const handleSelect = (projectId: string) => {
    onOpenChange(false);
    router.push(`/project/${projectId}`);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onOpenChange]);

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Search projects..." />
        <CommandList>
        <CommandEmpty>{!isLoading && 'No results found.'}</CommandEmpty>
        {isLoading && <div className="p-4 text-sm text-center text-muted-foreground">Loading projects...</div>}
        {projects && projects.length > 0 && (
          <CommandGroup heading="Recent Projects">
            {projects.map((project) => (
              <CommandItem key={project.id} value={project.name} onSelect={() => handleSelect(project.id)} className="aria-selected:bg-transparent">
                <div className="flex items-center space-x-3">
                  {project.previewImageUrl ? (
                      <Image
                          src={project.previewImageUrl}
                          alt={project.name}
                          width={40}
                          height={30}
                          className="rounded object-cover"
                          data-ai-hint={project.imageHint}
                      />
                  ) : (
                      <div className="w-10 h-[30px] flex items-center justify-center bg-muted rounded">
                          <File className="w-4 h-4 text-muted-foreground" />
                      </div>
                  )}
                  <span className="font-medium">{project.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
