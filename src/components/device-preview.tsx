'use client';
import { cn } from "@/lib/utils";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import React from "react";

export type Device = 'mobile' | 'tablet' | 'desktop';

const deviceConfig = {
  mobile: {
    width: 375,
    height: 812,
    scale: 1,
  },
  tablet: {
    width: 768,
    height: 1024,
    scale: 0.8,
  },
  desktop: {
    width: 1280,
    height: 800,
    scale: 0.7
  },
};

export function DevicePreview({ 
  children, 
  device = 'mobile' 
}: { 
  children: React.ReactNode; 
  device?: Device;
}) {
  
  const config = deviceConfig[device];

  const styles: React.CSSProperties = {
      width: `${config.width * config.scale}px`,
      height: `${config.height * config.scale}px`,
  };

  return (
    <div
      style={styles}
      className={cn(
        "relative mx-auto shadow-2xl overflow-hidden transition-all duration-300 ease-in-out bg-black",
        device === 'mobile' && "rounded-[20px] border-[10px] border-gray-900",
        device === 'tablet' && "rounded-xl border-8 border-gray-800",
        device === 'desktop' && "rounded-lg border-8 border-gray-800"
    )}>
       {device === 'mobile' && (
        <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-10"></div>
            <div className={cn("absolute flex justify-between items-center px-6 pt-3 pb-1 text-xs font-sans z-20 w-full", "bg-transparent text-white/80")}>
                <div>9:41</div>
                <div className="flex items-center gap-1">
                    <Signal size={14} />
                    <Wifi size={14} />
                    <BatteryFull size={16} />
                </div>
            </div>
        </>
       )}

      <div className={cn(
        "w-full h-full flex flex-col bg-black", 
        `transform scale-[${config.scale}]`
      )}
      style={{
        width: `${config.width}px`,
        height: `${config.height}px`,
        transform: `scale(${config.scale})`,
        transformOrigin: 'top left',
      }}
      >
        <div className="flex-1 overflow-y-auto bg-black">
          {children}
        </div>

        {device === 'mobile' && (
            <div className="py-3.5 flex justify-center">
                <div className={cn("w-28 h-1 rounded-full", "bg-gray-700")}></div>
            </div>
        )}
      </div>
    </div>
  );
}
