import type { PropsWithChildren } from 'react';

/**
 * Simple fixed-width container for consistent page padding.
 */
export default function Container({ children }: PropsWithChildren) {
  /**
   * Input: children (ReactNode)
   * Process: wrap with responsive paddings and max width
   * Output: centered content block
   */
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}