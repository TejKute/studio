import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

const AppLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", props.className)}
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(180, 80%, 70%)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#logo-gradient)" stroke="none" />
      <path d="M2 17l10 5 10-5" fill="url(#logo-gradient)" stroke="none" opacity="0.6" />
      <path d="M2 12l10 5 10-5" fill="url(#logo-gradient)" stroke="none" opacity="0.8" />
    </svg>
);

export default AppLogo;
