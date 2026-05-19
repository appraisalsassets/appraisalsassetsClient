"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTopHeaderVisible, setIsTopHeaderVisible] = useState(true);
  const pathname = usePathname();
  const { admin, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      setIsTopHeaderVisible(currentScrollY <= 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-40 w-full transition-all duration-500 ${
          isTopHeaderVisible
            ? "top-8 bg-white shadow-sm py-3 md:top-14 md:py-4"
            : isScrolled
              ? "top-0 bg-white/40 backdrop-blur-xl border-b border-white/20 py-3 shadow-sm"
              : "top-0 bg-white shadow-sm py-3 md:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <Link href={"/"}>
                <Image
                  src={"/logo.png"}
                  alt="logo"
                  width={80}
                  height={80}
                  className="h-14 w-14 object-contain md:h-20 md:w-20"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`md:text-base lg:text-lg text-base font-medium transition-colors duration-200 flex items-center gap-1 ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-gray-800 hover:text-primary ease-in transition-all duration-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex-1 flex justify-end md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 transition-transform hover:scale-110 active:scale-95"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Page Mobile Drawer */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-white flex flex-col shadow-2xl h-screen overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shrink-0">
              <div className="flex justify-between items-center py-6">
                <Link href={"/"}>
                  <Image src={"/logo.png"} alt="logo" width={60} height={60} />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 transition-transform hover:rotate-90 duration-300"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Navigation - Scrollable Content */}
            <nav className="grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ul className="space-y-8">
                  {NAV_LINKS.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex flex-col gap-2"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group inline-block w-full"
                      >
                        <span
                          className={`text-xl md:text-2xl lg:text-3xl font-light tracking-tight transition-colors wrap-break-word flex items-center gap-2 ${
                            pathname === link.href
                              ? "text-primary"
                              : "text-gray-900 group-hover:text-primary"
                          }`}
                        >
                          {link.name}
                        </span>
                      </Link>
                      <div className="h-px w-full bg-primary/20" />
                    </motion.li>
                  ))}
                </ul>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
