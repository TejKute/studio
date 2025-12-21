'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Download,
  Bot,
  Loader2,
  RefreshCw,
  CornerDownLeft,
  Smartphone,
  Tablet,
  Laptop,
  Minus,
  Plus,
  Paperclip,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { generateAppFromDescription } from '@/ai/flows/generate-app-from-description';
import Link from 'next/link';
import GeneratedComponentRenderer from '@/components/GeneratedComponentRenderer';
import { CodeBlock } from '@/components/code-block';
import { DevicePreview, type Device } from '@/components/device-preview';
import { MessageSquare, Code2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLogo from './app-logo';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  explanation?: string;
}

type EditorView = 'chat' | 'code';

const defaultZooms: Record<Device, number> = {
  mobile: 0.4,
  tablet: 0.3,
  desktop: 0.35,
};

function LoadingPreview() {
  return (
    <div className="p-4 bg-black h-full">
      <div className="space-y-4">
        <Skeleton className="h-12 w-full bg-gray-900" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-1/2 bg-gray-900" />
          <Skeleton className="h-10 w-1/2 bg-gray-900" />
        </div>
        <Skeleton className="h-24 w-full bg-gray-900" />
        <Skeleton className="h-40 w-full bg-gray-900" />
      </div>
    </div>
  );
}

const Preview = ({
  isGenerating,
  generatedCode,
}: {
  isGenerating: boolean;
  generatedCode: string | null;
}) => {
  if (isGenerating && !generatedCode) {
    return <LoadingPreview />;
  }

  return generatedCode ? (
    <GeneratedComponentRenderer code={generatedCode} />
  ) : (
    <div className="p-4 h-full bg-black text-white flex flex-col items-center justify-center text-center">
      <Bot size={48} className="text-gray-600 mb-4" />
      <h2 className="text-xl font-bold font-headline">AI App Preview</h2>
      <p className="text-gray-400">Your generated app will appear here.</p>
    </div>
  );
};

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={cn('flex items-start gap-3', isUser ? 'justify-end' : '')}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-black border border-gray-800">
          <AvatarFallback className="bg-transparent">
            <Bot size={18} className="text-gray-400" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3 text-sm',
          isUser ? 'bg-primary/10 text-gray-200' : 'bg-black/20 text-gray-300'
        )}
      >
        <p>{message.text}</p>
        {message.explanation && (
          <p className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
            {message.explanation}
          </p>
        )}
      </div>
    </div>
  );
};

export default function AIBuilder({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Describe the Flutter app you want to create.',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] =
    useState<string | null>(`// Your Flutter code will appear here`);
  const [isMounted, setIsMounted] = useState(false);
  const [device, setDevice] = useState<Device>('mobile');
  const [zoom, setZoom] = useState(defaultZooms.mobile);
  const [editorView, setEditorView] = useState<EditorView>('chat');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setZoom(defaultZooms[device]);
  }, [device]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsGenerating(true);

    try {
      const result = await generateAppFromDescription({
        description: currentInput,
      });
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `I have generated the Flutter code for a ${currentInput}. You can view it in the Code tab or export it.`,
        sender: 'ai',
        explanation: result.explanation,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setGeneratedCode(result.componentCode);
    } catch (error) {
      console.error(error);
      const aiErrorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Something went wrong. Please try again.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiErrorResponse]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const step = 0.1;
    setZoom((prev) => {
      const newZoom = direction === 'in' ? prev + step : prev - step;
      return Math.max(0.01, Math.min(1.0, newZoom));
    });
  };

  const handleResetZoom = () => setZoom(defaultZooms[device]);

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground">
      {isMounted && (
        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={40} minSize={30} className="flex flex-col h-screen">
            <header className="flex-shrink-0 h-14 flex items-center justify-between gap-1 p-2 border-b border-r border-border bg-background z-10">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground hover:text-white px-2">
                <AppLogo className="h-7 w-7" />
                <span className="font-headline text-lg font-bold text-white">Craftify</span>
              </Link>
              <div className="flex items-center gap-1">
                <Button variant={device === 'mobile' ? 'secondary' : 'ghost'} size="icon" onClick={() => setDevice('mobile')} className={cn('h-8 w-8', device === 'mobile' ? 'text-accent-foreground' : 'text-muted-foreground')} aria-label="Mobile preview">
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button variant={device === 'tablet' ? 'secondary' : 'ghost'} size="icon" onClick={() => setDevice('tablet')} className={cn('h-8 w-8', device === 'tablet' ? 'text-accent-foreground' : 'text-muted-foreground')} aria-label="Tablet preview">
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button variant={device === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => setDevice('desktop')} className={cn('h-8 w-8', device === 'desktop' ? 'text-accent-foreground' : 'text-muted-foreground')} aria-label="Desktop preview">
                  <Laptop className="h-4 w-4" />
                </Button>
              </div>
               <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleZoom('out')} className="h-7 w-7 rounded-full text-muted-foreground">
                  <Minus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={handleResetZoom} className="text-xs font-medium text-muted-foreground w-12 text-center h-7 rounded-full">
                  {Math.round(zoom * 100)}%
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleZoom('in')} className="h-7 w-7 rounded-full text-muted-foreground">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </header>
            <div className="flex-1 relative bg-black/50 overflow-hidden border-r border-border">
              <DevicePreview device={device} zoom={zoom}>
                <Preview isGenerating={isGenerating} generatedCode={generatedCode} />
              </DevicePreview>
            </div>
          </Panel>
          <PanelResizeHandle className="w-2 flex items-center justify-center bg-transparent group">
            <div className="w-1 h-8 rounded-full bg-border group-hover:bg-ring transition-colors" />
          </PanelResizeHandle>
          <Panel defaultSize={30} minSize={20} className="flex flex-col h-full bg-background">
            <header className="flex-shrink-0 h-14 flex items-center justify-between p-2 border-b border-border">
              <div className="font-semibold text-sm px-2">Chat</div>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditorView(editorView === 'code' ? 'chat' : 'code')}>
                    <Code2 className="h-4 w-4" />
                </Button>
                <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white">
                  Publish
                </Button>
              </div>
            </header>
            <div className="flex-1 flex flex-col min-h-0">
              {editorView === 'chat' ? (
                <>
                  <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                      ))}
                      {isGenerating && (
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 bg-muted border border-border">
                            <AvatarFallback className="bg-transparent">
                              <Bot size={18} className="text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="max-w-[75%] rounded-lg p-3 text-sm bg-muted text-muted-foreground flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span>Generating...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="border-t border-border bg-background p-3">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                       <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground shrink-0"
                          disabled={isGenerating}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe a change you want to see..."
                        className="pr-10 h-10 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-ring flex-1"
                        disabled={isGenerating}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-accent"
                        disabled={isGenerating || !input.trim()}
                      >
                        <CornerDownLeft className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                 <div className="flex-1 min-h-0">
                   <ScrollArea className="h-full">
                      <CodeBlock code={generatedCode ?? ''} />
                  </ScrollArea>
                </div>
              )}
            </div>
          </Panel>
           <PanelResizeHandle className="w-2 flex items-center justify-center bg-transparent group">
            <div className="w-1 h-8 rounded-full bg-border group-hover:bg-ring transition-colors" />
          </PanelResizeHandle>
           <Panel defaultSize={30} minSize={20} className="flex flex-col h-full bg-background">
             <header className="flex-shrink-0 h-14 flex items-center justify-between p-2 border-b border-border">
              <div className="font-semibold text-sm px-2">AI Response</div>
            </header>
             <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <CodeBlock code={generatedCode ?? ''} />
                </ScrollArea>
              </div>
          </Panel>
        </PanelGroup>
      )}
    </div>
  );
}

    