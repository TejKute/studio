'use client';
import React, { useState } from 'react';
import {
  ChevronRight,
  Folder as FolderIcon,
  File as FileIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileSystemNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileSystemNode[];
}

interface FileTreeProps {
  tree: FileSystemNode[];
  activeFile: string | null;
  onSelectFile: (path: string) => void;
  level?: number;
  basePath?: string;
}

const getIcon = (type: 'folder' | 'file') => {
  const commonClasses = 'h-4 w-4 mr-2 flex-shrink-0';
  if (type === 'folder') {
    return <FolderIcon className={cn(commonClasses, 'text-sky-400/80')} />;
  }
  return <FileIcon className={cn(commonClasses, 'text-muted-foreground/80')} />;
};

const FileNode: React.FC<FileTreeProps & { node: FileSystemNode }> = ({
  node,
  activeFile,
  onSelectFile,
  level = 0,
  basePath = '',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const currentPath = basePath ? `${basePath}/${node.name}` : node.name;
  const isSelected = activeFile === currentPath;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(currentPath);
    }
  };
  
  const handleSelect = (e: React.MouseEvent) => {
     e.stopPropagation();
     if (node.type === 'file') {
       onSelectFile(currentPath);
     } else {
       setIsOpen(!isOpen);
     }
  }

  return (
    <div className="text-sm file-tree-item">
      <div
        className={cn('flex items-center cursor-pointer rounded-md px-2 py-1', isSelected && 'selected')}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleSelect}
      >
        {node.type === 'folder' && (
          <ChevronRight
            className={cn(
              'h-4 w-4 mr-1 transform transition-transform duration-200 flex-shrink-0',
              isOpen && 'rotate-90'
            )}
          />
        )}
        {!node.children && <div className="w-5 flex-shrink-0"></div>}
        
        {getIcon(node.type)}
        <span className="truncate">{node.name}</span>
      </div>
      {isOpen && node.type === 'folder' && node.children && (
        <div>
          {node.children.map((child) => (
            <FileNode
              key={child.name}
              node={child}
              tree={[]}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              level={level + 1}
              basePath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
  tree,
  activeFile,
  onSelectFile,
}) => {
  return (
    <div className="py-2">
      {tree.map((node) => (
        <FileNode
          key={node.name}
          node={node}
          tree={tree}
          activeFile={activeFile}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
};
