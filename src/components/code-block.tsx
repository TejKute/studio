'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'dart', className }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const onCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
        toast({
            title: "Copied to clipboard!",
            description: "The code has been copied successfully.",
        });
      });
    }
  };

  return (
    <div className={cn('relative group font-code text-sm rounded-lg border bg-muted/50', className)}>
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
