import type { HTMLAttributes } from 'react';

/**
 * Small loading spinner for async states.
 * Input: optional className/size via props
 * Process: render an animated SVG spinner
 * Output: accessible spinner element
 */
export default function Spinner(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-flex items-center justify-center ${props.className ?? ''}`}
    >
      <svg
        className="h-5 w-5 animate-spin"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="4" fill="none" />
        <path d="M4 12a8 8 0 018-8" className="opacity-75" fill="currentColor" />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  );
}