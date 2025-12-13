'use client';
import { useState, useRef, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Bot, Loader2, RefreshCw, CornerDownLeft } from 'lucide-react';
import { PhonePreview } from '@/components/phone-preview';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { generateAppFromDescription } from '@/ai/flows/generate-app-from-description';
import {
  Home,
  LogIn,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  explanation?: string;
}

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

const Preview = ({ screen, isGenerating, generatedCode }: { screen: string, isGenerating: boolean, generatedCode: string | null }) => {
  if (isGenerating && !generatedCode) {
    return <LoadingPreview />;
  }

  const screens: { [key:string]: React.ReactNode } = {
    home: generatedCode ? <div dangerouslySetInnerHTML={{ __html: generatedCode }} /> : (
      <div className="p-4 h-full bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Home</h1>
          <p className="mt-2 text-gray-400">This is your home screen.</p>
        </div>
      </div>
    ),
    login: (
       <div className="p-4 h-full flex flex-col justify-center bg-black text-black">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <div className="space-y-4">
            <Input type="email" placeholder="Email" className="bg-gray-900 border-gray-800 text-white" />
            <Input type="password" placeholder="Password" className="bg-gray-900 border-gray-800 text-white" />
            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">Sign In</Button>
          </div>
      </div>
    ),
    dashboard: (
      <div className="p-4 h-full bg-black text-black">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-gray-900 border-gray-800"><CardContent><p>Card 1</p></CardContent></Card>
            <Card className="p-4 bg-gray-900 border-gray-800"><CardContent><p>Card 2</p></CardContent></Card>
            <Card className="p-4 col-span-2 bg-gray-900 border-gray-800"><CardContent><p>Full-width Card</p></CardContent></Card>
          </div>
      </div>
    ),
  };

  const content = screens[screen];

  return <div className="p-4 bg-black h-full">{content}</div>;
};


const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={cn('flex items-start gap-3', isUser ? 'justify-end' : '')}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-black border border-gray-800">
          <AvatarFallback className="bg-transparent"><Bot size={18} className="text-gray-400" /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3 text-sm',
          isUser
            ? 'bg-[#111111] text-gray-200'
            : 'bg-black text-gray-300'
        )}
      >
        <p>{message.text}</p>
        {message.explanation && <p className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">{message.explanation}</p>}
      </div>
    </div>
  );
};

function ProjectClientPage({ resolvedParams }: { resolvedParams: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! How can I help you design your app today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsGenerating(true);

    try {
        const result = await generateAppFromDescription({ description: currentInput });
        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `I have updated the preview based on your request.`,
            sender: 'ai',
            explanation: result.explanation
        };
        setMessages(prev => [...prev, aiResponse]);
        setGeneratedCode(result.componentCode);
        setCurrentScreen('home');
    } catch (error) {
        console.error(error);
        const aiErrorResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "I'm sorry, I encountered an error while generating the component. Please try again.",
            sender: 'ai'
        };
        setMessages(prev => [...prev, aiErrorResponse]);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate the component. Please check the console for more details.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    const lastUserMessage = messages.slice().reverse().find(m => m.sender === 'user');
    if (!lastUserMessage || isGenerating) {
        if(!isGenerating) {
            toast({
                variant: "destructive",
                title: "Nothing to regenerate",
                description: "Please send a message first.",
            });
        }
        return;
    }

    setIsGenerating(true);
    try {
        const result = await generateAppFromDescription({ description: lastUserMessage.text });
        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `I've regenerated the design for: "${lastUserMessage.text}".`,
            sender: 'ai',
            explanation: result.explanation
        };
        setMessages(prev => [...prev, aiResponse]);
        setGeneratedCode(result.componentCode);
        setCurrentScreen('home');
    } catch (error) {
        console.error(error);
        const aiErrorResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "I'm sorry, I encountered an error while regenerating the component. Please try again.",
            sender: 'ai'
        };
        setMessages(prev => [...prev, aiErrorResponse]);
         toast({
            variant: "destructive",
            title: "Regeneration Failed",
            description: "Could not regenerate the component. Please check the console for more details.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-black">
      <header className="flex h-14 items-center justify-between border-b border-[#111111] bg-black px-4 lg:px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
           <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-gray-200 hover:text-white">
            <span className="font-headline text-white">Craftify AI</span>
          </Link>
          <span className="text-sm text-gray-500">/</span>
          <span className="text-sm text-white font-medium">Project: {resolvedParams.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating} className="border-white/20 hover:bg-white/5">
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/5">
            <Download className="mr-2 h-4 w-4" />
            Export Code
          </Button>
        </div>
      </header>
      <main className="flex-1 min-h-0">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={50} minSize={30}>
            <div className="relative flex flex-col items-center justify-center p-4 md:p-8 bg-black h-full overflow-hidden">
              <Card className="w-full h-full max-w-md mx-auto shadow-2xl rounded-2xl flex flex-col overflow-hidden bg-black border-[#111111]">
                <CardContent className="p-0 flex-1 min-h-0">
                  <PhonePreview className="shadow-none border-none h-full max-w-full">
                    <Preview screen={currentScreen} isGenerating={isGenerating} generatedCode={generatedCode} />
                  </PhonePreview>
                </CardContent>
                <div className="flex items-center justify-between border-t border-[#111111] p-2 bg-black flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Button variant={currentScreen === 'home' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCurrentScreen('home')} className={currentScreen === 'home' ? 'bg-white/10' : ''}>
                      <Home className="h-4 w-4" />
                    </Button>
                    <Button variant={currentScreen === 'login' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCurrentScreen('login')} className={currentScreen === 'login' ? 'bg-white/10' : ''}>
                      <LogIn className="h-4 w-4" />
                    </Button>
                    <Button variant={currentScreen === 'dashboard' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCurrentScreen('dashboard')} className={currentScreen === 'dashboard' ? 'bg-white/10' : ''}>
                      <LayoutDashboard className="h-4 w-4" />
                    </Button>
                  </div>
                   <Link href="/settings">
                    <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </Panel>
          <PanelResizeHandle className="w-2 flex items-center justify-center bg-transparent group">
             <div className="w-1 h-8 rounded-full bg-[#111111] group-hover:bg-[#222222] transition-colors" />
          </PanelResizeHandle>
          <Panel defaultSize={50} minSize={30}>
            <div className="flex flex-col bg-black h-full border-l border-[#111111]">
                <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
                    <div className="space-y-6">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isGenerating && (
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 bg-black border border-gray-800">
                                <AvatarFallback className="bg-transparent"><Bot size={18} className="text-gray-400" /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-[75%] rounded-lg p-3 text-sm bg-black text-gray-300 flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-gray-400"/>
                              <span>Generating...</span>
                            </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
                <div className="border-t border-[#111111] bg-black p-4 md:p-6">
                    <form onSubmit={handleSendMessage} className="relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe a change you want to see..."
                            className="pr-12 h-12 bg-[#111111] border-[#111111] text-gray-200 placeholder:text-gray-500 focus:ring-gray-700"
                            disabled={isGenerating}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-800"
                            disabled={isGenerating || !input.trim()}
                        >
                            <CornerDownLeft className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}

export default function ProjectPage({ params }: { params: { id: string } }) {
    const resolvedParams = use(params);
    return <ProjectClientPage resolvedParams={resolvedParams} />;
}
