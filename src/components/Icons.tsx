import { useId, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const DashboardIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" stroke="none" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor" stroke="none" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" stroke="none" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor" stroke="none" />
  </Svg>
);

export const GroupsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="7.5" r="3.5" fill="currentColor" stroke="none" />
    <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5z" fill="currentColor" stroke="none" />
    <circle cx="17" cy="8.5" r="2.6" fill="currentColor" stroke="none" />
    <path d="M16.5 13.6c3 .2 5.2 2.7 5.2 5.9h-4.6c0-2.3-.2-4.3-.6-5.9z" fill="currentColor" stroke="none" />
  </Svg>
);

export function FundsIcon(p: IconProps) {
  // The "$" is cut out of the filled circle with a mask, so it works on any background.
  const id = "funds-mask-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <Svg {...p}>
      <mask id={id}>
        <rect width="24" height="24" fill="white" />
        <path
          d="M15 8.6c-.6-.9-1.7-1.4-3-1.4-1.8 0-3 .9-3 2.3 0 3.2 6.2 1.7 6.2 5 0 1.4-1.3 2.4-3.2 2.4-1.4 0-2.6-.6-3.2-1.6M12 5.5v13"
          stroke="black"
        />
      </mask>
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" mask={`url(#${id})`} />
    </Svg>
  );
}

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2" />
  </Svg>
);

export const SparkleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M10 3.5l1.9 5.6 5.6 1.9-5.6 1.9L10 18.5l-1.9-5.6-5.6-1.9 5.6-1.9z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M18.5 2.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="currentColor" stroke="none" />
    <path d="M18 15.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="currentColor" stroke="none" />
  </Svg>
);

export const PanelIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 4v16" />
  </Svg>
);

export const BellIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0" />
  </Svg>
);

export const LogoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8M10 12h11M17.5 8.5L21 12l-3.5 3.5" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const PlusCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 7.5v9M7.5 12h9" />
  </Svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const UsersIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="7" r="3" fill="currentColor" stroke="none" />
    <circle cx="5" cy="9" r="2.3" fill="currentColor" stroke="none" />
    <circle cx="19" cy="9" r="2.3" fill="currentColor" stroke="none" />
    <path d="M6.5 19c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6z" fill="currentColor" stroke="none" />
    <path d="M1 18c0-2.6 1.7-4.6 4-4.8.8 0 1.4.2 2 .5-1 1.2-1.6 2.7-1.8 4.3zM23 18c0-2.6-1.7-4.6-4-4.8-.8 0-1.4.2-2 .5 1 1.2 1.6 2.7 1.8 4.3z" fill="currentColor" stroke="none" />
  </Svg>
);

export const CalendarClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20H5a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v3M3 10h16M7.5 3v4M14.5 3v4" />
    <circle cx="17.5" cy="17.5" r="4.5" />
    <path d="M17.5 15.5v2.2l1.4 1" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </Svg>
);
