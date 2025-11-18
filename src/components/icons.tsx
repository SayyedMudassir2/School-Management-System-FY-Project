import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import type { SVGProps } from "react";

export const Icons = {
  google: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V12H9.8c.2 1.4 1.3 2.5 2.7 2.5z" />
      <path d="M12 8.5a3.5 3.5 0 0 1 3.5 3.5h-7a3.5 3.5 0 0 1 3.5-3.5z" />
    </svg>
  ),
  microsoft: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M11.5 3H3v8.5h8.5V3zM21 3h-8.5v8.5H21V3zM11.5 12.5H3V21h8.5v-8.5zM21 12.5h-8.5V21H21v-8.5z" />
    </svg>
  ),
};
