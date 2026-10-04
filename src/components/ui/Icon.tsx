import type { SVGProps } from 'react'

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-down'
  | 'arrow-left'
  | 'menu'
  | 'close'
  | 'star'
  | 'mail'
  | 'whatsapp'
  | 'phone'
  | 'copy'
  | 'check'
  | 'external'
  | 'chevron-down'
  | 'plus'
  | 'minus'
  | 'search'
  | 'trash'
  | 'edit'
  | 'eye'
  | 'eye-off'
  | 'send'
  | 'spinner'
  | 'browser'
  | 'mobile'
  | 'pen'
  | 'layers'
  | 'spark'
  | 'blocks'
  | 'quote'
  | 'lock'

const PATHS: Record<IconName, JSX.Element> = {
  'arrow-right': <path d="M4 12h15m0 0-6-6m6 6-6 6" />,
  'arrow-up-right': <path d="M7 17 17 7m0 0H8m9 0v9" />,
  'arrow-down': <path d="M12 4v15m0 0 6-6m-6 6-6-6" />,
  'arrow-left': <path d="M20 12H5m0 0 6-6m-6 6 6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  star: (
    <path
      d="m12 3.6 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-3.9 5.6-.8z"
      fill="currentColor"
      stroke="none"
    />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.6-3.9A8 8 0 1 1 20 11.5Z" />
      <path d="M9.2 9.4c.3 2.4 2.9 5 5.3 5.3.6.1 1.2-.4 1.3-1l-1.7-.9-.8.9c-1-.5-2-1.5-2.5-2.5l.9-.8-.9-1.7c-.6.1-1.1.7-1 1.3Z" />
    </>
  ),
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.4a11 11 0 0 0 5.1 5.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4H6a2 2 0 0 0-2 2v7.5A1.5 1.5 0 0 0 5.5 15" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </>
  ),
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M6.5 7 7.4 19a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9L17.5 7" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M14.5 6.5 17.5 9.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M4 4l16 16" />
      <path d="M9.9 5.9A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.4 4.2M6.4 7.9A16.8 16.8 0 0 0 2.5 12S6 18.5 12 18.5c1.2 0 2.3-.2 3.3-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  send: <path d="M20 4 3.5 10.5 10 13l3 6.5L20 4Zm0 0-10 9" />,
  spinner: <path d="M12 4v3m0 10v3m8-8h-3M7 12H4m12.5-5.5-2 2m-7 7-2 2m11 0-2-2m-7-7-2-2" />,
  browser: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18M6.5 6.8h.01M9 6.8h.01" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20h4L20 8a2.5 2.5 0 0 0-3.5-3.5L4 16.5V20Z" />
      <path d="m15 6 3 3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m4 12 8 4.3 8-4.3M4 16.5 12 21l8-4.5" />
    </>
  ),
  spark: (
    <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.7L12 18l-1.6-5.7L5 10.6 10.4 9 12 3.5ZM18.5 16l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
  ),
  blocks: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M17 14v6M14 17h6" />
    </>
  ),
  quote: (
    <path d="M9 6.5C6.5 8 5 10.4 5 13.4c0 2.4 1.4 4.1 3.4 4.1 1.8 0 3.1-1.3 3.1-3.1 0-1.7-1.2-3-2.9-3-.3 0-.6 0-.8.1.3-1.6 1.5-3 3.2-4L9 6.5Zm9 0c-2.5 1.5-4 3.9-4 6.9 0 2.4 1.4 4.1 3.4 4.1 1.8 0 3.1-1.3 3.1-3.1 0-1.7-1.2-3-2.9-3-.3 0-.6 0-.8.1.3-1.6 1.5-3 3.2-4L18 6.5Z" />
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 18, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}
