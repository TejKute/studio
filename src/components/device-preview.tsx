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

  const outerFrameClasses = cn(
    "relative mx-auto transition-all duration-300 ease-in-out",
    "flex items-center justify-center", // Center the inner phone frame
    device === 'mobile' && "rounded-[20px] border-[10px] border-gray-900 bg-gray-900 shadow-2xl",
    (device === 'tablet' || device === 'desktop') && "rounded-[14px] border border-[rgba(255,255,255,0.12)] p-1.5 bg-black/30",
  );
  
  const boxShadow = (device === 'tablet' || device === 'desktop') 
    ? '0 0 0 1px rgba(0,0,0,0.6), 0 12px 30px rgba(0,0,0,0.55)' 
    : undefined;


  const innerContentWrapperStyles: React.CSSProperties = {
    width: `${config.width}px`,
    height: `${config.height}px`,
    transform: `scale(${config.scale})`,
    transformOrigin: 'center center',
  };

  return (
    <div
      style={{ ...styles, boxShadow }}
      className={outerFrameClasses}
    >
       {device === 'mobile' && (
        <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-10"></div>
            <div className={cn("absolute flex justify-between items-center px-6 pt-1 pb-1 text-xs font-sans z-20 w-full top-1", "bg-transparent text-white/80")}>
                <div>9:41</div>
                <div className="flex items-center gap-1">
                    <Signal size={14} />
                    <Wifi size={14} />
                    <BatteryFull size={16} />
                </div>
            </div>
        </>
       )}

      <div
        className="flex flex-col bg-black overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: device === 'mobile' ? '10px' : '8px'
        }}
      >
        <div 
          className="flex-1 w-full h-full overflow-y-scroll"
        >
          <div style={{
             width: `${config.width}px`,
             minHeight: `${config.height}px`,
          }}>
            {children}
          </div>
        </div>
        
        {device === 'mobile' && (
            <div className="py-3.5 flex justify-center bg-black">
                <div className={cn("w-28 h-1 rounded-full", "bg-gray-700")}></div>
            </div>
        )}
      </div>
    </div>
  );
}
