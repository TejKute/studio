'use client';
import { cn } from "@/lib/utils";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import React from "react";

export type Device = 'mobile' | 'tablet' | 'desktop';

const deviceConfig = {
  mobile: {
    width: 390,
    height: 844,
    borderRadius: '28px',
  },
  tablet: {
    width: 768,
    height: 1024,
    borderRadius: '18px',
  },
  desktop: {
    width: 1280,
    height: 800,
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
  const { width, height } = deviceConfig[device];

  return (
    <div 
      id="preview-viewport"
      className="absolute inset-0 w-full h-full overflow-auto overscroll-contain p-8"
    >
      <div
          id="preview-scaled-content"
          style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              width: `${width}px`,
              height: `${height}px`,
          }}
          className="relative mx-auto my-8"
      >
          <div className="preview-glow-container">
              <div className="preview-glow-shine" />
              <div
                  id="preview-frame-wrapper"
                  className="relative mx-auto transition-all duration-300 rounded-[12px] bg-gradient-to-br from-yellow-300/80 via-amber-500/80 to-yellow-300/80 p-0.5 shadow-2xl shadow-amber-500/20"
                  style={{
                      width: `${width}px`,
                      height: `${height}px`,
                  }}
              >
                  <div 
                  className={cn(
                      "relative w-full h-full flex flex-col bg-black box-border",
                  )}
                  style={{ borderRadius: "12px" }}
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
                  
                  <div className="w-full h-full flex-1 overflow-hidden" style={{ borderRadius: "12px" }}>
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
    </div>
  );
}
