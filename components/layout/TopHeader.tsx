"use client";

import {
  Mail,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import SocialLinks from "./SocialLinks";

export default function TopHeader() {
  const [isVisible, setIsVisible] = useState(true);
  
  const MY_PHONE_1 = "+971 50 282 8397";
  const MY_PHONE_2 = "+971 4 288 5213";
  const MY_EMAIL = "info@assetsappraisals.com";

  // 1. SET YOUR PERMANENT LINKS HERE
  const [contact] = useState({
    phone1: MY_PHONE_1,
    phone2: MY_PHONE_2,
    email: MY_EMAIL,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. DISCOURAGE BACKEND OVERWRITE
  // We keep the API call structure if your project requires it for logs/analytics,
  // but we have removed the 'setContact' logic so it NEVER changes your links.
  useEffect(() => {
    api.getSiteContent()
      .then((res) => {
        // Backend data is received but ignored for contact/social links.
        console.log("Using local social links instead of API data.");
      })
      .catch(() => {});
  }, []);

  return (
    <header
      className={`w-full bg-secondary py-2 md:py-3 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } fixed top-0 left-0 right-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <div className="min-w-0 text-white flex items-center gap-2 md:gap-4 lg:gap-6">
          <div className="flex min-w-0 items-center gap-2 text-xs sm:text-sm">
            <Phone className="h-4 w-4 shrink-0" />
            <a
              href={`tel:${contact.phone1.replace(/\s/g, "")}`}
              className="whitespace-nowrap hover:text-primary transition-all duration-300"
            >
              {contact.phone1}
            </a>
            <span className="hidden opacity-50 sm:inline">|</span>
            <a
              href={`tel:${contact.phone2.replace(/\s/g, "")}`}
              className="hidden whitespace-nowrap hover:text-primary transition-all duration-300 sm:inline"
            >
              {contact.phone2}
            </a>
          </div>

          <a
            href={`mailto:${contact.email}`}
            className="hidden sm:flex items-center gap-2 hover:text-primary ease-in transition-all duration-300 text-sm"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span>{contact.email}</span>
          </a>
        </div>

        <div className="hidden items-center gap-1 sm:flex md:gap-3">
          <SocialLinks
            linkClassName="text-white hover:text-primary p-1 md:p-2 transition-all duration-200"
            iconClassName="h-3.5 w-3.5 md:h-4 md:w-4"
          />
        </div>
      </div>
    </header>
  );
}
