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
    "box-border",
    {
      "w-[390px] h-[760px] rounded-[28px] p-3.5 border-[8px] border-gray-900": device === 'mobile',
      "w-[820px] max-h-[75vh] aspect-[4/3] rounded-[18px] border p-1.5 border-[rgba(255,255,255,0.12)] shadow-[0_0_0_1px_rgba(0,0,0,0.6),_0_12px_30px_rgba(0,0,0,0.55)]": device === 'tablet',
      "w-full max-w-[1280px] max-h-[78vh] aspect-video rounded-[12px] border p-1.5 border-[rgba(255,255,255,0.12)] shadow-[0_0_0_1px_rgba(0,0,0,0.6),_0_12px_30px_rgba(0,0,0,0.55)]": device === 'desktop',
    }
  );

  const contentWrapperClasses = cn(
    "relative w-full h-full flex-1 flex flex-col bg-black overflow-hidden",
    {
      "rounded-[20px]": device === 'mobile',
      "rounded-lg": device === 'tablet',
      "rounded-[6px]": device === 'desktop'
    }
  );
  
  return (
    <div className={frameClasses}>
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
            <div 
              className="origin-top-center transition-transform duration-300 ease-in-out"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            >
              {children}
           </div>
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
