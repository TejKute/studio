import { cn } from "@/lib/utils";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import React from "react";

export function PhonePreview({ children, className }: { children: React.ReactNode; className?: string; }) {
  return (
    <div className={cn(
        "relative w-full max-w-sm h-full mx-auto rounded-[40px] border-[10px] shadow-2xl overflow-hidden",
        "border-gray-900 bg-black",
        className
    )}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-10"></div>
      <div className={cn("w-full h-full flex flex-col", "bg-black")}>
        {/* Status Bar */}
        <div className={cn(
            "flex justify-between items-center px-6 pt-3 pb-1 text-xs font-sans z-20",
             "bg-transparent text-white/80"
        )}>
          <div>9:41</div>
          <div className="flex items-center gap-1">
            <Signal size={14} />
            <Wifi size={14} />
            <BatteryFull size={16} />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto bg-black">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="py-3.5 flex justify-center">
            <div className={cn("w-28 h-1 rounded-full", "bg-gray-700")}></div>
        </div>
      </div>
    </div>
  );
}
