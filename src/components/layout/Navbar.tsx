import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "@/store/cart";
import SearchBar from "@/components/search/SearchBar";
import clsx from "clsx";

/**
 * Input: none
 * Process: render a fixed, full-width header with larger height for better prominence
 * Output: responsive navbar with bigger top row and category rail
 */
export default function Navbar() {
  const totalQty = useCart((s) => s.totalQty);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top row: height -> h-16 (was h-14) */}
      <div className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Brand: font size up */}
          <Link
            to="/"
            className="whitespace-nowrap text-xl font-bold text-primary"
          >
            Misumi-like
          </Link>

          {/* Desktop search (large pill) */}
          <div className="mx-auto hidden w-full max-w-3xl md:block">
            {/* wider than before */}
            <SearchBar />
          </div>

          {/* Actions (right) */}
          <nav className="ml-auto flex items-center gap-1 md:gap-3">
            {/* Mobile: search toggle */}
            <button
              aria-label="Toggle search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 md:hidden"
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>

            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "relative inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-primary border-b-2 border-primary"
                  : "relative inline-flex h-10 items-center rounded-md px-3 text-sm text-gray-700 hover:bg-gray-100"
              }
            >
              Cart
              {totalQty > 0 && (
                <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none text-white">
                  {totalQty}
                </span>
              )}
            </NavLink>

            {/* Desktop: links */}
            <div className="hidden items-center gap-2 sm:flex">
              <NavLink
                to="/category/all"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md px-3 py-2 text-sm font-semibold text-primary border-b-2 border-primary"
                    : "rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md px-3 py-2 text-sm font-semibold text-primary border-b-2 border-primary"
                    : "rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                }
              >
                Orders
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md px-3 py-2 text-sm font-semibold text-primary border-b-2 border-primary"
                    : "rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                }
              >
                Wishlist
              </NavLink>
            </div>

            {/* Mobile: hamburger */}
            <button
              aria-label="Toggle menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile: collapsible search */}
        {mobileSearchOpen && (
          <div className="border-t md:hidden">
            <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
              <SearchBar />
            </div>
          </div>
        )}

        {/* Mobile: simple menu */}
        {mobileMenuOpen && (
          <div className="border-t md:hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-2 py-3 text-sm">
                <NavLink
                  to="/category/ic"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  IC
                </NavLink>
                <NavLink
                  to="/category/resistors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resistors
                </NavLink>
                <NavLink
                  to="/category/sensors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sensors
                </NavLink>
                <NavLink
                  to="/category/motors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Motors
                </NavLink>
                <NavLink
                  to="/category/leds"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  LEDs
                </NavLink>
                <NavLink
                  to="/category/capacitors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Capacitors
                </NavLink>
                <NavLink
                  to="/category/mcu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  MCU Boards
                </NavLink>
                <NavLink
                  to="/category/power"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Power Modules
                </NavLink>
                <NavLink
                  to="/category/all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </NavLink>
                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    isActive
                      ? "shrink-0 text-primary font-semibold border-b-2 border-primary"
                      : "shrink-0 hover:text-primary"
                  }
                >
                  Wishlist
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-md px-3 py-2 text-sm text-primary font-semibold border-b-2 border-primary"
                      : "rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  }
                >
                  Orders
                </NavLink>

                <div className="mt-2 border-t pt-2"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category rail: height -> h-12 (was h-10) for bigger tap targets */}
      <div className="w-full border-b bg-gray-50">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-5 overflow-x-auto px-4 text-sm text-gray-700 md:gap-7 md:overflow-visible">
          <NavLink
            to="/category/ic"
            className={({ isActive }) =>
              clsx(
                "shrink-0",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            IC
          </NavLink>
          <NavLink
            to="/category/resistors"
            className={({ isActive }) =>
              clsx(
                "shrink-0",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            Resistors
          </NavLink>
          <NavLink
            to="/category/sensors"
            className={({ isActive }) =>
              clsx(
                "shrink-0",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            Sensors
          </NavLink>
          <NavLink
            to="/category/motors"
            className={({ isActive }) =>
              clsx(
                "shrink-0",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            Motors
          </NavLink>
          <NavLink
            to="/category/leds"
            className={({ isActive }) =>
              clsx(
                "shrink-0",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            LEDs
          </NavLink>
          <NavLink
            to="/category/capacitors"
            className={({ isActive }) =>
              clsx(
                "shrink-0",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            Capacitors
          </NavLink>
          <NavLink
            to="/category/mcu"
            className={({ isActive }) =>
              clsx(
                "shrink-0",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            MCU Boards
          </NavLink>
          <NavLink
            to="/category/power"
            className={({ isActive }) =>
              clsx(
                "shrink-0",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            Power Modules
          </NavLink>
          <NavLink
            to="/category/all"
            className={({ isActive }) =>
              clsx(
                "ml-auto hidden shrink-0 md:block",
                isActive
                  ? "text-primary font-semibold border-b-2 border-primary"
                  : "hover:text-primary"
              )
            }
          >
            All
          </NavLink>
        </div>
      </div>
    </header>
  );
}
