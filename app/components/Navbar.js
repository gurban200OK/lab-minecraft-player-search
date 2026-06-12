"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", emoji: "🏠" },
    { href: "/search", label: "Search", emoji: "🔍" },
    { href: "/about", label: "About", emoji: "📖" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200/50 bg-white/75 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                ⛏️
              </span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-400">
                CraftSeeker
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 scale-[1.02]"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200"
                  }`}
                >
                  <span className="text-base">{link.emoji}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
