
'use client';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
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
  X,
  ExternalLink,
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
import { DevicePreview, type Device } from '@/components/device-preview';
import { MessageSquare, Code2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLogo from './app-logo';
import Image from 'next/image';
import { CodeView } from '@/components/code-view';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { type Project } from '@/types';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { publishProject } from '@/lib/publish';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  explanation?: string;
}

type EditorView = 'chat' | 'code';

const defaultZooms: Record<Device, number> = {
  mobile: 0.45,
  tablet: 0.4,
  desktop: 0.32,
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
  const firestore = useFirestore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Describe the Flutter app you want to create.',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode]
    = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [device, setDevice] = useState<Device>('mobile');
  const [zoom, setZoom] = useState(defaultZooms.mobile);
  const [editorView, setEditorView] = useState<EditorView>('chat');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);


  const projectRef = useMemoFirebase(() => {
    if (!firestore || !projectId) return null;
    // This assumes a user is logged in, which should be handled by layout/middleware
    // A robust solution would get the userId from useUser()
    const pathSegments = doc(firestore, '.')._key.path.segments;
    const userId = pathSegments.length > 1 ? pathSegments[1] : 'default-user'; // Fallback
     if (typeof(window) !== "undefined") {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.uid) {
        return doc(firestore, 'users', user.uid, 'projects', projectId);
      }
    }
    return null;
  }, [firestore, projectId]);

  const { data: project, isLoading: isProjectLoading } = useDoc<Project>(projectRef);
  
  useEffect(() => {
    if (project?.generatedCode) {
      setGeneratedCode(project.generatedCode);
    }
  }, [project]);


  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  }, [messages, attachmentPreview]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !attachment) || isGenerating) return;

    // TODO: Handle message with attachment
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    const currentAttachment = attachment;

    setInput('');
    setAttachment(null);
    setAttachmentPreview(null);
    setIsGenerating(true);

    try {
      const result = await generateAppFromDescription({
        description: currentInput,
      });

      if (projectRef) {
        await updateDoc(projectRef, {
          generatedCode: result.componentCode,
          updatedAt: serverTimestamp()
        });
      }

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

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreview(reader.result as string);
        };
        reader.readDataURL(file);
      } else {
        setAttachmentPreview(null); // Or show a generic file icon
      }
    }
  };
  
  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handlePublish = async () => {
    if (!project || !projectRef) {
      toast({
        variant: 'destructive',
        title: 'Publish Failed',
        description: 'Could not find project data to publish.',
      });
      return;
    }

    setIsPublishing(true);
    await updateDoc(projectRef, { status: 'publishing' });
    toast({
      title: 'Publish Initiated',
      description: 'Your project is being prepared for publishing. This may take a moment.',
    });

    try {
      // Simulate a network delay for the build process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      publishProject(project);

      // On success, update the project status to 'live' and set a mock URL
      const liveUrl = `https://${project.name.toLowerCase().replace(/\s+/g, '-')}-${projectId.slice(0, 6)}.craftify.app`;
      await updateDoc(projectRef, { 
        status: 'live',
        liveUrl: liveUrl,
        updatedAt: serverTimestamp() 
      });

      toast({
        title: 'Project Published!',
        description: 'Your project is now live.',
      });

    } catch (error) {
      console.error('Publishing error:', error);
      await updateDoc(projectRef, { status: 'failed' });
      toast({
        variant: 'destructive',
        title: 'Publish Failed',
        description: 'Something went wrong during the publish process.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownload = () => {
    if (!project || !generatedCode) {
       toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'No code has been generated to download.',
      });
      return;
    }
    toast({
      title: 'Download Started',
      description: 'Your project files are being bundled into a ZIP archive.',
    });
    // In a real app, this would trigger a server-side process
    // to zip the files and initiate a download.
    console.log("Simulating ZIP download for project:", project.id);
  };


  const ChatPanel = () => (
    <>
      <ScrollArea className="flex-1 p-4 no-scrollbar" ref={scrollAreaRef}>
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
        {attachmentPreview && (
          <div className="relative w-20 h-20 mb-2 rounded-md overflow-hidden border border-border">
            <Image src={attachmentPreview} alt="Attachment preview" layout="fill" objectFit="cover" />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 hover:bg-black/75 text-white"
              onClick={removeAttachment}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
           <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground shrink-0"
              disabled={isGenerating}
              onClick={handleAttachmentClick}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf,.txt"
            />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Describe a change you want to see..."
            className="pr-10 h-10 bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-ring flex-1"
            disabled={isGenerating}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-accent"
            disabled={isGenerating || (!input.trim() && !attachment)}
          >
            <CornerDownLeft className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );

  const PublishButton = () => {
    const isLive = project?.status === 'live';
    const isPublishingInProgress = project?.status === 'publishing' || isPublishing;

    if (isLive && project.liveUrl) {
      return (
         <Button asChild size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white">
            <Link href={project.liveUrl} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live
            </Link>
        </Button>
      );
    }

    return (
        <Button onClick={handlePublish} size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white" disabled={isPublishingInProgress}>
            {isPublishingInProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isPublishingInProgress ? 'Publishing...' : project?.status === 'failed' ? 'Retry Publish' : 'Publish'}
        </Button>
    )
  }


  if (!isMounted || isProjectLoading) {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
          <AppLogo className="h-12 w-12 animate-pulse" />
        </div>
      );
  }

  if (editorView === 'code') {
    return (
      <div className="h-screen w-full flex flex-col bg-[#1e1e1e] text-foreground">
        <header className="flex-shrink-0 h-14 flex items-center justify-between gap-1 p-2 border-b border-white/10 bg-[#1e1e1e] z-10">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground hover:text-white px-2">
                <AppLogo className="h-7 w-7" />
                <span className="font-headline text-lg font-bold text-white">Craftify</span>
            </Link>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditorView('chat')}>
                    <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                </Button>
                <PublishButton />
            </div>
        </header>
        <div className="flex-1 flex flex-col min-h-0">
          <CodeView code={generatedCode ?? ''} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground">
        <PanelGroup direction="horizontal" className="flex-1">
          {editorView === 'chat' && (
            <Panel defaultSize={40} minSize={30} className="flex flex-col h-screen">
              <header className="flex-shrink-0 h-14 flex items-center justify-between gap-1 p-2 border-b border-border bg-background z-10 rounded-b-xl">
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
              <div className="flex-1 relative bg-black/50 overflow-auto no-scrollbar">
                <DevicePreview device={device} zoom={zoom}>
                  <Preview isGenerating={isGenerating} generatedCode={generatedCode} />
                </DevicePreview>
              </div>
            </Panel>
          )}
          {editorView === 'chat' && <PanelResizeHandle className="w-2 flex items-center justify-center bg-transparent group">
            <div className="w-1 h-8 rounded-full bg-transparent group-hover:bg-ring transition-colors" />
          </PanelResizeHandle>}
          <Panel defaultSize={60} minSize={20} className="flex flex-col h-full bg-background">
          <header className="flex-shrink-0 h-14 flex items-center justify-end p-2 border-b border-border rounded-b-xl">
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditorView('code')}>
                    <Code2 className="h-4 w-4" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                </Button>
                <PublishButton />
              </div>
            </header>
            <div className="flex-1 flex flex-col min-h-0">
              <ChatPanel />
            </div>
          </Panel>
        </PanelGroup>
    </div>
  );
}

    