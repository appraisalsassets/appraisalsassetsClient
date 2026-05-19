"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Send,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import api from "@/lib/api";
import SocialLinks from "./SocialLinks";

function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      const response = await api.subscribe({ email });

      if (response.success) {
        toast.success(response.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(response.message || "Failed to subscribe");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-800 bg-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="max-w-xl text-center md:text-left">
          <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
            Stay Updated with Market Insights
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400 sm:text-base">
            Get the latest Dubai real estate news and exclusive property
            listings delivered to your inbox.
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] md:max-w-xl"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="h-12 w-full min-w-0 rounded-lg border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-gray-500 focus:border-[#C1A06E]/50 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#C1A06E] px-6 text-sm font-medium text-white transition-colors hover:bg-[#a88b5e] disabled:opacity-50 sm:w-auto"
          >
            <Send className="h-4 w-4 shrink-0" />
            {loading ? "..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-secondary text-white">
      <NewsletterBar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image src="/logo.png" alt="Logo" width={80} height={80} />
            </Link>

            <p className="max-w-sm text-sm leading-7 text-gray-300">
              Dubai&#39;s premier real estate advisory firm specializing in
              luxury properties, asset valuation, and investment guidance.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <SocialLinks
                linkClassName="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 transition-all duration-300 hover:border-primary hover:text-primary"
                iconClassName="h-5 w-5"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                { label: "Properties", href: "/properties" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Off-Plan Developers", href: "/developers" },
                { label: "Trusted Partners", href: "/trusted-partners" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Popular Areas
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                {
                  label: "Dubai Marina",
                  href: "/properties?location=dubai_marina",
                },
                {
                  label: "Downtown Dubai",
                  href: "/properties?location=downtown_dubai",
                },
                {
                  label: "Palm Jumeirah",
                  href: "/properties?location=palm_jumeirah",
                },
                {
                  label: "Business Bay",
                  href: "/properties?location=bussiness_bay",
                },
                {
                  label: "Dubai Hills",
                  href: "/properties?location=dubai_hills",
                },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Contact Us
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm leading-6 text-gray-300">
                  Office No: 79 Al Fahidi St - Al Hamriya - Bur Dubai.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="space-y-1">
                  <a
                    href="tel:+971502828397"
                    className="block text-sm text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    +971-50-282-8397
                  </a>

                  <a
                    href="tel:+97142885213"
                    className="block text-sm text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    +971-4-288-5213
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <a
                  href="mailto:info@assetsappraisals.com"
                  className="break-all text-sm leading-6 text-gray-300 transition-colors duration-200 hover:text-white"
                >
                  info@assetsappraisals.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-800 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:justify-between md:text-left">
            <p className="text-sm leading-6 text-gray-400">
              © 2026 Assets & Appraisal. All rights reserved. RERA Certified.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
