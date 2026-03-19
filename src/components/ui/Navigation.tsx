"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/works", label: "Works" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-20">
      <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter hover:text-accent transition-colors">
          BST Inc.
        </Link>

        {/* Links */}
        <div className="glass-panel flex items-center gap-1 p-1 rounded-full shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-accent text-[#112f4f] shadow-md"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
