'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Bot, Loader2, Wand2, Sun, Moon, CornerDownLeft, RefreshCw, ArrowRight, Home, LogIn, LayoutDashboard } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { PhonePreview } from '@/components/phone-preview';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

function LoadingPreview() {
  return (
    <div className="p-4 bg-background h-full">
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

function Preview({ screen, isDarkMode, isGenerating }: { screen: string, isDarkMode: boolean, isGenerating: boolean }) {
  if (isGenerating) {
    return <LoadingPreview />;
  }

  const screens: { [key: string]: React.ReactNode } = {
    home: (
      <div className={cn("p-4 h-full", isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black')}>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Home</h1>
          <p className={cn("mt-2", isDarkMode ? 'text-gray-400' : 'text-gray-600')}>This is your home screen.</p>
        </div>
      </div>
    ),
    login: (
       <div className={cn("p-4 h-full flex flex-col justify-center", isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black')}>
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <div className="space-y-4">
            <Input type="email" placeholder="Email" className={cn(isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100')} />
            <Input type="password" placeholder="Password" className={cn(isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100')} />
            <Button className="w-full">Sign In</Button>
          </div>
      </div>
    ),
    dashboard: (
      <div className={cn("p-4 h-full", isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black')}>
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-2 gap-4">
            <Card className={cn("p-4", isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}><CardContent><p>Card 1</p></CardContent></Card>
            <Card className={cn("p-4", isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}><CardContent><p>Card 2</p></CardContent></Card>
            <Card className={cn("p-4 col-span-2", isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}><CardContent><p>Full-width Card</p></CardContent></Card>
          </div>
      </div>
    ),
  };

  return <>{screens[screen]}</>;
}


const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={cn('flex items-start gap-3', isUser ? 'justify-end' : '')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback><Bot size={18} /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl p-3 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted rounded-bl-none'
        )}
      >
        {message.text}
      </div>
      {isUser && (
         <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/seed/201/100/100" />
            <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! How can I help you design your app today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Mock AI response
    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiResponse: Message = { id: (Date.now() + 1).toString(), text: `Sure, I've updated the preview based on your request: "${input}".`, sender: 'ai' };
    setMessages(prev => [...prev, aiResponse]);
    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    const lastUserMessage = messages.slice().reverse().find(m => m.sender === 'user');
    if (!lastUserMessage) {
        toast({
            variant: "destructive",
            title: "Nothing to regenerate",
            description: "Please send a message first.",
        });
        return;
    }
    
    setIsGenerating(true);
    // Mock AI call
    await new Promise(resolve => setTimeout(resolve, 2000));
    const aiResponse: Message = { id: (Date.now() + 1).toString(), text: `I've regenerated the design for: "${lastUserMessage.text}".`, sender: 'ai' };
    setMessages(prev => [...prev, aiResponse]);
    setIsGenerating(false);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-muted/20">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <ArrowRight className="h-6 w-6 rotate-180" />
          <span className="font-headline">AI Builder</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Project: {params.id}</span>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Code
          </Button>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden">
        {/* Left Panel: Live Preview */}
        <div className="relative flex flex-col items-center justify-center p-4 md:p-8 bg-background overflow-hidden">
           <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 opacity-50 blur-[120px]"></div>

          <Card className="w-full h-full max-w-4xl mx-auto shadow-2xl rounded-2xl flex flex-col overflow-hidden">
            <CardContent className="p-2 flex-1">
              <PhonePreview className="shadow-none border-none h-full max-w-full">
                <Preview screen={currentScreen} isDarkMode={isDarkMode} isGenerating={isGenerating} />
              </PhonePreview>
            </CardContent>
            <div className="flex items-center justify-between border-t p-2 bg-muted/50">
              <div className="flex items-center gap-1">
                <Button variant={currentScreen === 'home' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCurrentScreen('home')}>
                  <Home className="h-4 w-4" />
                </Button>
                <Button variant={currentScreen === 'login' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCurrentScreen('login')}>
                  <LogIn className="h-4 w-4" />
                </Button>
                 <Button variant={currentScreen === 'dashboard' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCurrentScreen('dashboard')}>
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel: AI Chat */}
        <div className="flex flex-col bg-background h-full">
            <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                {isGenerating && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={18} /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-[75%] rounded-2xl p-3 text-sm bg-muted rounded-bl-none flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin"/>
                           <span>Generating...</span>
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="border-t bg-background p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                    </Button>
                </div>
                <form onSubmit={handleSendMessage} className="relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe a change you want to see..."
                        className="pr-12 h-12"
                        disabled={isGenerating}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8"
                        disabled={isGenerating || !input.trim()}
                    >
                        <CornerDownLeft className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}
