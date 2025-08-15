import { useState } from 'react';

/**
 * Large pill search for light mode; sized to match taller header.
 */
export default function SearchBar() {
  const [q, setQ] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search"
        placeholder="Search by part number, keyword, brand..."
        className="h-12 w-full rounded-full border border-gray-300 bg-white pl-12 pr-36 text-base text-gray-900 placeholder:text-gray-400 shadow-sm
                   outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-full bg-primary px-5 text-sm font-medium text-white hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}