import { cn } from "@/lib/utils";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import React from "react";

export function PhonePreview({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full max-w-[360px] mx-auto rounded-[40px] border-[10px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden", className)}>
      <div className="w-full h-full bg-background flex flex-col">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-4 py-1.5 bg-background text-foreground text-xs font-sans">
          <div>9:41</div>
          <div className="flex items-center gap-1">
            <Signal size={14} />
            <Wifi size={14} />
            <BatteryFull size={16} />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="py-2.5 flex justify-center">
            <div className="w-28 h-1 rounded-full bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
}
