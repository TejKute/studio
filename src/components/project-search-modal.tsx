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
import { formatDistanceToNow } from 'date-fns';
import { File } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

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

  const getDisplayDate = (dateValue?: Project['createdAt'] | Project['updatedAt']) => {
    if (!dateValue) return null;
    let date: Date;
    if (typeof dateValue === 'object' && 'seconds' in dateValue) {
      const ts = dateValue as Timestamp;
      date = ts.toDate();
    } else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
        return null;
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };


  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Search projects..." />
        <CommandList>
        <CommandEmpty>{!isLoading && 'No results found.'}</CommandEmpty>
        {isLoading && <div className="p-4 text-sm text-center text-muted-foreground">Loading projects...</div>}
        {projects && projects.length > 0 && (
          <CommandGroup heading="Recent Projects">
            {projects.map((project) => {
              const displayDate = getDisplayDate(project.updatedAt || project.createdAt);
              return (
              <CommandItem key={project.id} value={project.name} onSelect={() => handleSelect(project.id)}>
                <div className="flex items-center justify-between w-full">
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
                    <div className='flex flex-col'>
                        <span className="font-medium">{project.name}</span>
                        {user && (
                            <div className="flex items-center gap-1.5">
                                <Avatar className="h-4 w-4">
                                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                                    <AvatarFallback className="text-[8px]">{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{user.displayName}</span>
                            </div>
                        )}
                    </div>
                    </div>
                     {displayDate && (
                       <span className="text-xs text-muted-foreground">
                        {displayDate}
                      </span>
                     )}
                  </div>
              </CommandItem>
            )})}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
