"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

type PartnerDeveloper = {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  displayOrder?: number;
};

export default function TrustedPartnersPage() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<PartnerDeveloper[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.getDevelopers();
        if (response.success && Array.isArray(response.developers)) {
          const withLogos = response.developers
            .filter(
              (developer: { logo?: string; isActive?: boolean }) =>
                developer.isActive !== false &&
                typeof developer.logo === "string" &&
                developer.logo.trim().length > 0,
            )
            .map(
              (developer: {
                _id: string;
                id?: string;
                name: string;
                slug: string;
                logo: string;
                displayOrder?: number;
              }) => ({
                _id: String(developer.id ?? developer._id),
                name: developer.name,
                slug: developer.slug,
                logo: developer.logo.trim(),
                displayOrder: developer.displayOrder ?? 0,
              }),
            )
            .sort((a, b) => {
              if (a.displayOrder !== b.displayOrder) {
                return a.displayOrder - b.displayOrder;
              }
              return a.name.localeCompare(b.name);
            });

          setPartners(withLogos);
        }
      } catch (error) {
        console.error("Failed to load trusted partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const partnerCountLabel = useMemo(() => {
    if (partners.length === 0) return "No partners to display yet";
    return `${partners.length} trusted developer partner${partners.length === 1 ? "" : "s"}`;
  }, [partners.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50"
    >
      {/* Hero */}
      <section className="relative mt-28 min-h-[38vh] bg-primary-dark flex items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
            alt="Dubai skyline"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C1A06E]/20 text-[#C1A06E] text-sm font-medium mb-4"
          >
            <Handshake className="w-4 h-4" />
            Off-Plan Developers
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Trusted Partners
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-lg max-w-2xl mx-auto"
          >
            We collaborate with leading Dubai developers. Partner logos are managed
            from the admin panel and shown here when uploaded.
          </motion.p>
        </div>
      </section>

      {/* Logos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-[#C1A06E] uppercase tracking-wider">
            Our network
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Developer partners
          </h2>
          <p className="text-slate-600 mt-2">{partnerCountLabel}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#C1A06E] mb-4" />
            <p>Loading partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto">
            <p className="text-slate-600 mb-6">
              Partner logos will appear here once developers are added in the admin
              panel with a logo image.
            </p>
            <Link href="/developers">
              <Button className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
                View Off-Plan Developers
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {partners.map((partner, index) => (
              <motion.li
                key={partner._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Link
                  href={`/developers/${partner.slug}`}
                  title={partner.name}
                  className="group flex h-28 sm:h-32 items-center justify-center rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-[#C1A06E]/40 hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-16 sm:max-h-20 w-auto max-w-full object-contain grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </section>
    </motion.div>
  );
}
