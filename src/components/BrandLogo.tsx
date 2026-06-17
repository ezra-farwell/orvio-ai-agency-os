import type React from "react";
// Brand logos as inline SVG. Keep them recognizable but lightweight —
// these render at 16–40px in cards, badges, and table cells.

type Props = { className?: string; size?: number };

export function MetaLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className={className} aria-label="Meta">
      <defs>
        <linearGradient id="meta-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0064E0" />
          <stop offset="50%" stopColor="#0082FB" />
          <stop offset="100%" stopColor="#A972FF" />
        </linearGradient>
      </defs>
      <path
        fill="url(#meta-g)"
        d="M6 22.5c0-6.6 3.4-12 8.3-12 3 0 5.2 1.7 7.8 5.4 2.5 3.7 4 5.4 5.4 5.4 1.5 0 2.6-1.4 2.6-3.9 0-3.5-1.6-7.4-4-7.4-1.4 0-2.6.8-4.4 3.1l-1.9-2.3C22.3 8 24.2 6.6 26.6 6.6c4.4 0 7.4 4.6 7.4 10.7 0 4.4-2.2 7.2-5.6 7.2-2.5 0-4.4-1.3-7.1-5.1-2.7-3.9-4.1-5.6-5.6-5.6-2.2 0-4 3.4-4 8.3 0 1.6.3 3 .9 4l-2.8 1.7C8.7 26.3 6 24.7 6 22.5z"
      />
    </svg>
  );
}

export function GoogleAdsLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-label="Google Ads">
      <path fill="#FBBC04" d="M5.93 21.92a3 3 0 0 1-2.6-4.5L9.74 6.34a3 3 0 0 1 5.2 3l-6.4 11.08a3 3 0 0 1-2.6 1.5z" />
      <path fill="#4285F4" d="M18.07 21.92a3 3 0 0 0 2.6-4.5L14.26 6.34a3 3 0 0 0-5.2 3l6.4 11.08a3 3 0 0 0 2.6 1.5z" />
      <circle cx="6" cy="19" r="3" fill="#34A853" />
    </svg>
  );
}

export function StripeLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-label="Stripe">
      <rect width="32" height="32" rx="6" fill="#635BFF" />
      <path
        fill="#fff"
        d="M14.6 13.1c0-.8.7-1.1 1.7-1.1 1.5 0 3.4.5 4.9 1.3v-4.6c-1.6-.6-3.3-.9-4.9-.9-4 0-6.7 2.1-6.7 5.6 0 5.4 7.5 4.6 7.5 6.9 0 .9-.8 1.2-2 1.2-1.7 0-3.9-.7-5.5-1.6v4.7c1.8.8 3.7 1.1 5.5 1.1 4.1 0 6.9-2 6.9-5.6 0-5.8-7.4-4.9-7.4-7z"
      />
    </svg>
  );
}

export function RedditLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-label="Reddit">
      <circle cx="16" cy="16" r="16" fill="#FF4500" />
      <path
        fill="#fff"
        d="M25 16a2.3 2.3 0 0 0-3.9-1.6c-1.4-.9-3.3-1.5-5.3-1.6l1-3.5 3 .7a1.7 1.7 0 1 0 .2-1.2l-3.4-.8a.6.6 0 0 0-.7.4l-1.1 3.9c-2 .1-3.9.7-5.4 1.6A2.3 2.3 0 1 0 7 17.5a4 4 0 0 0 0 .6c0 3.1 3.6 5.6 8 5.6s8-2.5 8-5.6a4 4 0 0 0 0-.6A2.3 2.3 0 0 0 25 16zm-13 1.7a1.4 1.4 0 1 1 2.8 0 1.4 1.4 0 0 1-2.8 0zm8 3.7c-1.1 1.1-3.3 1.2-3.9 1.2s-2.8 0-3.9-1.2a.4.4 0 0 1 .6-.6c.7.7 2.2.9 3.3.9s2.6-.2 3.3-.9a.4.4 0 0 1 .6.6zm-.4-2.3a1.4 1.4 0 1 1 1.4-1.4 1.4 1.4 0 0 1-1.4 1.4z"
      />
    </svg>
  );
}

export function XLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-label="X">
      <rect width="32" height="32" rx="6" fill="#000" />
      <path
        fill="#fff"
        d="M21.5 7h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.8-5.1 5.8H7.5l6.5-7.5L7.1 7h5.7l4 5.3L21.5 7zm-1 14.8h1.6L12 8.8h-1.7l10.2 13z"
      />
    </svg>
  );
}

export function TikTokLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-label="TikTok">
      <rect width="32" height="32" rx="6" fill="#000" />
      <path
        fill="#25F4EE"
        d="M21.3 11.4a5.6 5.6 0 0 1-3-1.4v7.8a4.7 4.7 0 1 1-4.7-4.7v2.3a2.4 2.4 0 1 0 2.4 2.4V7h2.3a3.3 3.3 0 0 0 3 4.4z"
      />
      <path
        fill="#FE2C55"
        d="M22.3 12.4a5.6 5.6 0 0 1-3-1.4v7.8a4.7 4.7 0 1 1-4.7-4.7v2.3a2.4 2.4 0 1 0 2.4 2.4V8h2.3a3.3 3.3 0 0 0 3 4.4z"
      />
      <path
        fill="#fff"
        d="M21.8 11.9a5.6 5.6 0 0 1-3-1.4v7.8a4.7 4.7 0 1 1-4.7-4.7v2.3a2.4 2.4 0 1 0 2.4 2.4V7.5h2.3a3.3 3.3 0 0 0 3 4.4z"
      />
    </svg>
  );
}

export function TwilioLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-label="Twilio">
      <circle cx="16" cy="16" r="16" fill="#F22F46" />
      <circle cx="12" cy="12" r="2.5" fill="#fff" />
      <circle cx="20" cy="12" r="2.5" fill="#fff" />
      <circle cx="12" cy="20" r="2.5" fill="#fff" />
      <circle cx="20" cy="20" r="2.5" fill="#fff" />
    </svg>
  );
}

export function PostmarkLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-label="Postmark">
      <rect width="32" height="32" rx="6" fill="#FFDE00" />
      <path fill="#222" d="M8 10l8 6 8-6v2l-8 6-8-6v-2zm0 4l8 6 8-6v8H8v-8z" />
    </svg>
  );
}

export function CallRailLogo({ className, size = 24 }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-label="CallRail">
      <rect width="32" height="32" rx="6" fill="#45A4EC" />
      <path
        fill="#fff"
        d="M11 9a2 2 0 0 0-2 2v3c0 5 4 9 9 9h3a2 2 0 0 0 2-2v-2a1 1 0 0 0-.8-1l-3-.6a1 1 0 0 0-1 .3l-1 1.2a10 10 0 0 1-5-5l1.2-1a1 1 0 0 0 .3-1l-.6-3a1 1 0 0 0-1-.8h-2z"
      />
    </svg>
  );
}

// Generic — looks up by provider id/name.
const MAP: Record<string, (p: Props) => React.ReactElement> = {
  meta: MetaLogo,
  "meta ads": MetaLogo,
  "meta marketing api": MetaLogo,
  facebook: MetaLogo,
  instagram: MetaLogo,
  google: GoogleAdsLogo,
  "google ads": GoogleAdsLogo,
  "google ads api": GoogleAdsLogo,
  stripe: StripeLogo,
  "stripe connect": StripeLogo,
  reddit: RedditLogo,
  "reddit ads": RedditLogo,
  x: XLogo,
  "x ads": XLogo,
  tiktok: TikTokLogo,
  "tiktok ads": TikTokLogo,
  twilio: TwilioLogo,
  "twilio sms": TwilioLogo,
  postmark: PostmarkLogo,
  "postmark email": PostmarkLogo,
  callrail: CallRailLogo,
};

export function BrandLogo({ name, size = 24, className }: Props & { name: string }) {
  const key = name.toLowerCase().trim();
  const Cmp = MAP[key];
  if (Cmp) return <Cmp size={size} className={className} />;
  // fallback initial
  return (
    <span
      className={className}
      style={{
        width: size, height: size, borderRadius: 8, display: "inline-grid",
        placeItems: "center", background: "#52525B", color: "#fff",
        fontSize: size * 0.45, fontWeight: 700,
      }}
    >
      {name.charAt(0)}
    </span>
  );
}
