import AIBuilder from '@/components/ai-builder';

// This is the main Server Component for the project page.
// Its only job is to get the project ID and pass it to the client-side AIBuilder.
export default function ProjectPage({ params }: { params: { id: string } }) {
  return <AIBuilder projectId={params.id} />;
}
