
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  X,
  Bot,
  Layers,
  Sparkles,
  FileText,
  Palette,
  LayoutGrid,
} from 'lucide-react';
import { Badge } from './ui/badge';
import Image from 'next/image';

interface WhatsNewPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const updates = [
  {
    icon: <Bot className="h-5 w-5 text-sky-400" />,
    title: 'AI-Powered App Generation',
    description:
      'Turn your text descriptions into fully functional Flutter app code. The future of app development is here.',
    date: '4 days ago',
    image: 'https://picsum.photos/seed/wn1/400/200',
    aiHint: 'abstract code',
  },
  {
    icon: <Palette className="h-5 w-5 text-violet-400" />,
    title: 'Dynamic Theme Generation',
    description:
      "Describe a color scheme or a mood, and let our AI generate a complete theme for your application's UI.",
    date: '1 week ago',
    aiHint: 'color palette',
  },
  {
    icon: <LayoutGrid className="h-5 w-5 text-teal-400" />,
    title: 'New Dashboard & Project View',
    description:
      'A redesigned dashboard inspired by the best developer tools. Manage your projects with ease and style.',
    date: '2 weeks ago',
    aiHint: 'dashboard ui',
  },
];

const templates = [
  {
    icon: <FileText className="h-5 w-5 text-amber-400" />,
    title: 'E-commerce App Template',
    description: 'A ready-to-use template for building online stores.',
    status: 'Coming Soon',
  },
  {
    icon: <FileText className="h-5 w-5 text-amber-400" />,
    title: 'Fitness Tracker Template',
    description: 'Scaffold a fitness application in seconds.',
    status: 'Coming Soon',
  },
];

export function WhatsNewPanel({ isOpen, onOpenChange }: WhatsNewPanelProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-16 right-4 h-auto max-h-[calc(100vh-8rem)] w-96 translate-x-0 translate-y-0 transform-none !rounded-xl border-border bg-background/80 p-0 shadow-2xl backdrop-blur-xl data-[state=closed]:slide-out-to-right-0 data-[state=open]:slide-in-from-right-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border p-4">
          <DialogTitle className="text-lg font-headline font-semibold">
            What's New
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col">
          <Tabs defaultValue="whats-new" className="flex-1">
            <TabsList className="mx-4 my-2">
              <TabsTrigger value="whats-new">What's New</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[60vh] px-4">
              <TabsContent value="whats-new" className="mt-0 space-y-4">
                {updates.map((update, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden bg-card/50 transition-shadow hover:shadow-md"
                  >
                    {update.image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={update.image}
                          alt={update.title}
                          width={400}
                          height={200}
                          className="object-cover"
                          data-ai-hint={update.aiHint}
                        />
                      </div>
                    )}
                    <CardHeader className="flex-row items-start gap-4 p-4">
                      {update.icon}
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {update.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {update.date}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {update.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="templates" className="mt-0 space-y-4">
                {templates.map((template, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden bg-card/50 transition-shadow hover:shadow-md"
                  >
                    <CardHeader className="flex-row items-start gap-4 p-4">
                      {template.icon}
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold">
                          {template.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                       <Badge variant="outline">{template.status}</Badge>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
          <div className="border-t border-border p-4">
             <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border border-border text-center">
                <h4 className="font-semibold text-sm text-white">Upgrade to Pro</h4>
                <p className="text-xs text-muted-foreground mt-1">Unlock more benefits & features.</p>
                <Button size="sm" disabled className="w-full mt-2 h-8 text-xs bg-primary/20 hover:bg-primary/30">Coming Soon</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
