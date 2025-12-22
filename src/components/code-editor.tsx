'use client';
import { CodeBlock } from './code-block';
import { ScrollArea } from './ui/scroll-area';

interface CodeEditorProps {
  code: string;
}

export function CodeEditor({ code }: CodeEditorProps) {
  return (
    <ScrollArea className="absolute inset-0 no-scrollbar">
        <CodeBlock code={code} className="h-full w-full rounded-none border-none text-sm" />
    </ScrollArea>
  );
}
