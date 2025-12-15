'use client';
import AIBuilder from '@/components/ai-builder';

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <AIBuilder projectId={params.id} />;
}
