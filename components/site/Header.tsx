"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { company, nav } from "@/lib/brand";
import { Logo } from "./Logo";

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

  // Hover state lives on the wrapper around the button AND dropdown so the
  // menu stays open while the pointer is over either. A short close delay
  // lets the pointer travel the small gap between button and dropdown.
  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpenMenu(null);
      closeTimer.current = null;
    }, 180);
  }
  function cancelClose() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }
  function openOnHover(label: string | null) {
    cancelClose();
    setOpenMenu(label);
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
    >
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <Logo />

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 lg:flex xl:gap-2"
        >
          {nav.map((item) => {
            const isOpen = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  openOnHover(item.children ? item.label : null)
                }
                onMouseLeave={item.children ? scheduleClose : undefined}
              >{item.children ? (
                  <>
                    <Link
                      href={item.href}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onFocus={() => openOnHover(item.label)}
                      onClick={() => setOpenMenu(null)}
                      className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-ink hover:text-archblue"
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 12 12"
                        className="h-3 w-3 transition-transform rotate-180"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M2 4l4 4 4-4" />
                      </svg>
                    </Link>
                  <div
                    role="menu"
                    className="absolute left-0 top-full z-50 w-60 rounded-lg border border-line bg-white py-2 shadow-lg"
                    style={{
                      visibility: isOpen ? 'visible' : 'hidden',
                      opacity: isOpen ? 1 : 0,
                      transition: 'opacity 0.2s ease, visibility 0.2s ease'
                    }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href + child.label}
                        href={child.href}
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-ink hover:bg-ivory hover:text-archblue"
                        onClick={() => setOpenMenu(null)}
                      >
                        {child.label}
                        <svg
                          viewBox="0 0 12 12"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 4l4 4 4-4" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-semibold text-ink hover:text-archblue"
                    >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
          <Link href="/enquire" className="btn-primary ml-3 !px-5 !py-2.5">
            Enquire Now
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={company.phoneHref}
            className="hidden rounded-md p-2 text-navy hover:bg-ivory sm:block"
            aria-label={`Call ${company.phone}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 0 1 2-2h2.6a1 1 0 0 1 1 .8l.7 3.4a1 1 0 0 1-.5 1.1L7 9.5a13 13 0 0 0 5.5 5.5l1.2-1.8a1 1 0 0 1 1.1-.4l3.4.7a1 1 0 0 1 .8 1V17a2 2 0 0 1-2 2h-1A14 14 0 0 1 3 7V5Z"
              />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2 text-navy hover:bg-ivory"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="overflow-y-auto border-t border-line bg-white px-4 pb-6 pt-2 lg:hidden backdrop-blur supports-[backdrop-filter]:bg-white/95"
        >
          <div className="max-h-[calc(100dvh-5rem)] transform transition-all duration-300 ease-in-out">
            {nav.map((item) => (
            <div key={item.label} className="border-b border-line/60 last:border-0">
              {item.children ? (
                <div>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ink bg-white border-b border-line/60 hover:bg-ivory"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 absolute right-0 top-1/2 -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                  </button>
                  <div className="mt-2">{item.children.map((child) => (
                    <Link
                      key={child.href + child.label}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-ivory hover:text-archblue"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}</div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block py-3 text-sm font-semibold text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/enquire"
              className="btn-primary w-full"
              onClick={() => setMobileOpen(false)}
            >
              Enquire Now
            </Link>
            <a href={company.phoneHref} className="btn-outline-navy w-full">
              Call {company.phoneDisplay}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
