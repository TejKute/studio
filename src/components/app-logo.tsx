import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

const AppLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    className={cn("h-6 w-6", props.className)}
    {...props}
  >
    <rect width="256" height="256" fill="none" />
    <path
      d="M32,80V56a8,8,0,0,1,8-8H80"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
    <path
      d="M176,48h40a8,8,0,0,1,8,8V80"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
    <path
      d="M80,208H40a8,8,0,0,1-8-8V176"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
    <path
      d="M224,176v24a8,8,0,0,1-8,8H176"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
    <path
      d="M94.4,106A40.2,40.2,0,0,1,128,88a40,40,0,0,1,40,40,40.2,40.2,0,0,1-22,36.1"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
    <polyline
      points="161.6 106 136 128 161.6 150"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
  </svg>
);

export default AppLogo;
