import { cn } from "@/lib/utils";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import React from "react";

export function PhonePreview({ children, className, isDarkMode }: { children: React.ReactNode; className?: string; isDarkMode?: boolean }) {
  return (
    <div className={cn(
        "w-full h-full mx-auto rounded-[40px] border-[10px] shadow-2xl overflow-hidden",
        "border-gray-900 bg-gray-900",
        className
    )}>
      <div className={cn("w-full h-full flex flex-col", "bg-gray-950")}>
        {/* Status Bar */}
        <div className={cn(
            "flex justify-between items-center px-4 py-1.5 text-xs font-sans",
             "bg-transparent text-white"
        )}>
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
            <div className={cn("w-28 h-1 rounded-full", "bg-gray-700")}></div>
        </div>
      </div>
    </div>
  );
}
