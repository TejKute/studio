'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import * as Lucide from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface GeneratedComponentRendererProps {
  code: string;
}

const scope = {
  React,
  useState,
  useEffect,
  Card,
  Button,
  Input,
  Label,
  Avatar,
  Progress,
  Badge,
  ...Lucide,
};

function LoadingComponent() {
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

const GeneratedComponentRenderer: React.FC<GeneratedComponentRendererProps> = ({ code }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    try {
      // The function body will now directly contain the AI-generated code.
      // The generated code is expected to be a self-contained functional component.
      const functionBody = `
        const { ${Object.keys(scope).join(', ')} } = scope;
        ${code}
      `;
      
      const factory = new Function('scope', functionBody);
      const newComponent = factory(scope);

      setComponent(() => newComponent);
      setError(null);
    } catch (e: any) {
      console.error("Error creating component from string:", e);
      setError("Failed to render the generated component. Please check the syntax.");
      setComponent(null);
    }
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 text-red-300 h-full flex flex-col items-center justify-center">
        <Lucide.AlertTriangle className="h-8 w-8 mb-2" />
        <p className="text-center font-semibold">Render Error</p>
        <p className="text-center text-sm">{error}</p>
      </div>
    );
  }
  
  if (!Component) {
    return <LoadingComponent />;
  }

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Component />
    </Suspense>
  );
};

export default GeneratedComponentRenderer;
