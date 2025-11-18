import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 170 50"
      width="122"
      height="35"
      {...props}
    >
      <g transform="translate(10, 0)">
        <path d="M22 10v6.09c0 1.3-.84 2.54-2.07 3.02l-8.5 3.39c-.93.37-1.93.37-2.86 0l-8.5-3.39A3.42 3.42 0 010 16.09V10a2 2 0 012-2h20a2 2 0 012 2zM4 11.43v4.66l8 3.2 8-3.2V11.43l-8 3.2-8-3.2z" fill="#3b82f6" transform="translate(0, 10)"/>
        <path d="M11 18.09l-8-3.2V10l8 3.2v4.89z" fill="#3b82f6" opacity="0.7" transform="translate(0, 10)"/>
        <path d="M11 25.09l8-3.2V17l-8 3.2v4.89z" fill="#3b82f6" opacity="0.7" transform="translate(0, 10)" />
        <path d="M22 10v6.09c0 1.3-.84 2.54-2.07 3.02l-8.5 3.39c-.93.37-1.93.37-2.86 0l-8.5-3.39A3.42 3.42 0 010 16.09V10" stroke="#3b82f6" strokeWidth="2" fill="none" transform="translate(0, 10)"/>
        <line x1="11" y1="14" x2="11" y2="25" stroke="#3b82f6" strokeWidth="2" transform="translate(0, 10)" />
        <text
          x="68"
          y="32"
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="currentColor"
        >
          Aedura
        </text>
      </g>
    </svg>
  ),
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
