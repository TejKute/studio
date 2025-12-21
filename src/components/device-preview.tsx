'use client';
import { cn } from "@/lib/utils";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import React from "react";

export type Device = 'mobile' | 'tablet' | 'desktop';

export function DevicePreview({ 
  children, 
  device = 'mobile',
  zoom = 1,
}: { 
  children: React.ReactNode; 
  device?: Device;
  zoom?: number;
}) {

  const frameClasses = cn(
    "relative mx-auto transition-all duration-300 ease-in-out flex flex-col bg-black shadow-2xl",
    "box-border origin-top",
    // Base border style for all devices
    "border border-[rgba(255,255,255,0.08)]",
    {
      // Mobile-specific styles
      "w-[390px] h-[760px] rounded-[28px] p-3.5 border-[8px] border-gray-900": device === 'mobile',
      // Tablet-specific styles
      "w-[768px] max-h-[75vh] aspect-[4/3] rounded-[18px] p-2": device === 'tablet',
      // Desktop-specific styles
      "w-full max-w-[1200px] max-h-[78vh] aspect-[16/10] rounded-[14px] p-2": device === 'desktop',
    }
  );

  const contentWrapperClasses = cn(
    "relative w-full h-full flex-1 flex flex-col bg-black overflow-hidden",
    {
      "rounded-[20px]": device === 'mobile',
      "rounded-lg": device === 'tablet',
      "rounded-md": device === 'desktop'
    }
  );
  
  return (
    <div 
      className={frameClasses}
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
    >
       {device === 'mobile' && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl"></div>
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

      <div className={contentWrapperClasses}>
        <div className="w-full h-full flex-1 overflow-y-scroll">
            {children}
        </div>
        
        {device === 'mobile' && (
            <div className="py-3.5 flex justify-center bg-black/80 backdrop-blur-sm border-t border-white/5 relative z-20">
                <div className="w-28 h-1 rounded-full bg-gray-700"></div>
            </div>
        )}
      </div>
    </div>
  );
}
