'use client';
import { cn } from "@/lib/utils";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import React from "react";

export type Device = 'mobile' | 'tablet' | 'desktop';

const deviceConfig = {
  mobile: {
    width: 390,
    height: 780,
    borderRadius: '28px',
  },
  tablet: {
    width: 640,
    height: 820,
    borderRadius: '18px',
  },
  desktop: {
    width: 1024,
    height: 720,
    borderRadius: '12px',
  },
};

export function DevicePreview({ 
  children, 
  device = 'mobile',
  zoom = 1,
}: { 
  children: React.ReactNode; 
  device?: Device;
  zoom?: number;
}) {

  const { width, height, borderRadius } = deviceConfig[device];

  // Layer 1: The fixed-size viewport that clips content.
  const viewportStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
    position: 'relative',
  };

  // Layer 2: The ONLY scrollable element.
  const scrollContainerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflowX: 'auto',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarGutter: 'stable',
    touchAction: 'pan-x pan-y',
  };

  // Layer 3: The content that gets scaled.
  const scaledContentStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `scale(${zoom})`,
    transformOrigin: 'top center',
    pointerEvents: 'auto',
  };

  return (
    <div 
      className="relative mx-auto"
      style={viewportStyle}
    >
        <div 
            style={scrollContainerStyle}
        >
            <div style={scaledContentStyle}>
                <div className={cn(
                    "relative w-full h-full flex flex-col bg-black box-border",
                    "border border-[rgba(255,255,255,0.08)]",
                    "shadow-[0_0_0_1px_rgba(0,0,0,0.6),0_12px_30px_rgba(0,0,0,0.55)]"
                    )}
                    style={{ borderRadius: borderRadius }}
                >
                    {device === 'mobile' && (
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl"></div>
                        <div className="absolute flex justify-between items-center px-6 pt-1 text-xs font-sans w-full top-3 text-white/80">
                            <div>9:41</div>
                            <div className="flex items-center gap-1">
                                <Signal size={14} />
                                <Wifi size={14} />
                                <BatteryFull size={16} />
                            </div>
                        </div>
                    </div>
                    )}
                    
                    <div className="w-full h-full flex-1">
                    {children}
                    </div>

                    {device === 'mobile' && (
                    <div className="py-3.5 flex justify-center bg-black/80 backdrop-blur-sm border-t border-white/5 relative z-20">
                        <div className="w-28 h-1 rounded-full bg-gray-700"></div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
