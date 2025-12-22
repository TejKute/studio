
'use client';

import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Input } from '@/components/ui/input';
import { FileTree } from '@/components/file-tree';
import { CodeEditor } from '@/components/code-editor';
import { Files, Search } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

// This is a mock. In a real app, this would come from a server or be dynamically generated.
const mockFileTree = [
  {
    name: 'public',
    type: 'folder',
    children: [{ name: 'favicon.ico', type: 'file' }],
  },
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [{ name: 'button.tsx', type: 'file' }],
      },
      { name: 'app.css', type: 'file' },
      { name: 'index.tsx', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
];

export function CodeView({ code }: { code: string }) {
  const [activeFile, setActiveFile] = useState('src/index.tsx');

  // In a real app, you would fetch the content of the selected file.
  // Here, we just show the same generated code for any file.
  const fileContent = code;

  return (
    <div className="flex h-full flex-col bg-background">
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={20} minSize={15} className="flex flex-col">
          <div className="flex h-12 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <Files className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Files</h2>
            </div>
          </div>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search files..." className="h-8 pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1 px-2 no-scrollbar">
            <FileTree
              tree={mockFileTree}
              activeFile={activeFile}
              onSelectFile={setActiveFile}
            />
          </ScrollArea>
        </Panel>
        <PanelResizeHandle className="w-2 flex items-center justify-center bg-transparent group">
            <div className="w-1 h-8 rounded-full bg-transparent group-hover:bg-ring transition-colors" />
        </PanelResizeHandle>
        <Panel defaultSize={80} minSize={30} className="flex flex-col">
           <div className="flex h-12 items-center border-b border-border px-4">
              <span className="text-sm text-muted-foreground">{activeFile}</span>
           </div>
           <div className="flex-1 relative">
             <CodeEditor code={fileContent} />
           </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
