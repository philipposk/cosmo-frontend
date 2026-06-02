import type { CSSProperties, ReactNode, SVGProps } from "react";

export type IconName =
  | "home"
  | "book"
  | "pen"
  | "grid"
  | "chat"
  | "target"
  | "sparkle"
  | "settings"
  | "crown"
  | "search"
  | "bell"
  | "plus"
  | "photo"
  | "mic"
  | "poll"
  | "heart"
  | "msg"
  | "share"
  | "bookmark"
  | "check"
  | "arrow"
  | "dots"
  | "flame"
  | "eye"
  | "lock"
  | "users"
  | "folder"
  | "palette"
  | "headphones"
  | "film"
  | "star";

const PATHS: Record<IconName, ReactNode> = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />,
  book: (
    <>
      <path d="M4 4h7a3 3 0 0 1 3 3v13" />
      <path d="M20 4h-7a3 3 0 0 0-3 3v13" />
      <path d="M4 4v16h7" />
      <path d="M20 4v16h-7" />
    </>
  ),
  pen: (
    <>
      <path d="M14 4l6 6" />
      <path d="M4 20l4-1 11.5-11.5a2.1 2.1 0 0 0 0-3l-1-1a2.1 2.1 0 0 0-3 0L4 16z" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  chat: <path d="M4 5h16v11H8l-4 4z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  crown: (
    <>
      <path d="M3 17l2-10 5 5 2-8 2 8 5-5 2 10z" />
      <path d="M3 20h18" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0v5l1.5 3h-15L6 13z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  photo: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m3 17 5-5 4 4 3-3 6 6" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </>
  ),
  poll: <path d="M5 21V10M12 21V3M19 21v-7" />,
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  msg: <path d="M4 5h16v12H10l-4 4v-4H4z" />,
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8 11 8-4M8 13l8 4" />
    </>
  ),
  bookmark: <path d="M6 4h12v17l-6-4-6 4z" />,
  check: <path d="m5 12 4 4 10-10" />,
  arrow: <path d="M5 12h14M13 5l7 7-7 7" />,
  dots: (
    <>
      <circle cx="6" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="18" cy="12" r="1.2" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4-1 4 1 5 2 5" />
      <path d="M12 21c4 0 7-3 7-7 0-5-4-6-7-11-3 5-7 6-7 11 0 4 3 7 7 7z" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3.5" />
      <path d="M2 20a7 7 0 0 1 14 0" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M16 20a5 5 0 0 1 6-5" />
    </>
  ),
  folder: <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.6 0 2-1 2-2 0-2 2-2 2-4s-2-2-2-4 2-2 2-4-2-4-4-4z" />
      <circle cx="7" cy="11" r="1" />
      <circle cx="9" cy="7" r="1" />
      <circle cx="14" cy="7" r="1" />
      <circle cx="17" cy="11" r="1" />
    </>
  ),
  headphones: (
    <>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M3 17a2 2 0 0 1 2-2h2v6H5a2 2 0 0 1-2-2zM21 17a2 2 0 0 0-2-2h-2v6h2a2 2 0 0 0 2-2z" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M3 15h18M9 4v16M15 4v16" />
    </>
  ),
  star: <path d="m12 3 2.6 6 6.4.6-4.9 4.4 1.5 6.4L12 17.3l-5.6 3.1 1.5-6.4L3 9.6 9.4 9z" />,
};

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
} & Omit<SVGProps<SVGSVGElement>, "name" | "style" | "className">;

export function Icon({ name, size = 16, className, style, ...rest }: Props) {
  return (
    <svg
      {...rest}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}

export default Icon;
