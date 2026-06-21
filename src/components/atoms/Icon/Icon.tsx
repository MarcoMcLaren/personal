import type { SVGProps } from 'react';

export type IconName =
  | 'github'
  | 'linkedin'
  | 'mail'
  | 'phone'
  | 'arrow-down'
  | 'arrow-up-right'
  | 'star'
  | 'sparkle'
  | 'location'
  | 'graduation'
  | 'trophy'
  | 'menu'
  | 'close';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, JSX.Element> = {
  github: (
    <path
      fill="currentColor"
      d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
    />
  ),
  mail: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6.5h18v11H3zM3.5 7l8.5 6 8.5-6"
    />
  ),
  phone: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l1 4v3a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1Z"
    />
  ),
  'arrow-down': (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4v16M6 14l6 6 6-6"
    />
  ),
  'arrow-up-right': (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 17 17 7M8 7h9v9"
    />
  ),
  star: (
    <path
      fill="currentColor"
      d="M12 2.5c.4 0 .76.24.92.6l2.3 5.27 5.72.5c.39.03.72.3.84.67.12.37 0 .78-.3 1.03l-4.33 3.77 1.29 5.6c.09.38-.06.78-.38 1.01a.96.96 0 0 1-1.07.05L12 17.6l-4.99 3c-.34.2-.76.18-1.07-.05a.98.98 0 0 1-.38-1l1.29-5.6L2.52 10.2a.98.98 0 0 1-.3-1.03c.12-.38.45-.64.84-.67l5.72-.5 2.3-5.27c.16-.36.52-.6.92-.6Z"
    />
  ),
  sparkle: (
    <path
      fill="currentColor"
      d="M12 2c.3 3.4 1.6 5.6 4 6.5-2.4.9-3.7 3.1-4 6.5-.3-3.4-1.6-5.6-4-6.5 2.4-.9 3.7-3.1 4-6.5ZM19 13c.18 1.9.95 3.1 2.3 3.6-1.35.5-2.12 1.7-2.3 3.6-.18-1.9-.95-3.1-2.3-3.6 1.35-.5 2.12-1.7 2.3-3.6Z"
    />
  ),
  location: (
    <>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
      />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
    </>
  ),
  graduation: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4 2 9l10 5 10-5-10-5ZM6 11v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5"
    />
  ),
  trophy: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 18h6M10 18l.5-3h3l.5 3M8 21h8"
    />
  ),
  menu: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      d="M4 7h16M4 12h16M4 17h16"
    />
  ),
  close: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      d="M6 6l12 12M18 6 6 18"
    />
  ),
};

export function Icon({ name, size = 22, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
