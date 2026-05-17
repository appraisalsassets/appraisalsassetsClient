"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake, Loader2 } from "lucide-react";
import api from "@/lib/api";
import PageHero from "@/components/layout/PageHero";
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
        const response = await api.getTrustedPartners();
        if (response.success && Array.isArray(response.partners)) {
          setPartners(
            response.partners.map(
              (partner: {
                id: string;
                name: string;
                slug: string;
                logo: string;
                displayOrder?: number;
              }) => ({
                _id: partner.id,
                name: partner.name,
                slug: partner.slug,
                logo: partner.logo,
                displayOrder: partner.displayOrder ?? 0,
              }),
            ),
          );
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
      <PageHero
        title="Trusted Partners"
        description="We collaborate with leading Dubai developers. Partner logos are managed from the admin panel and shown here when uploaded."
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
        backgroundAlt="Dubai skyline"
        badge={
          <span className="mb-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#C1A06E]/20 px-4 py-1.5 text-sm font-medium text-[#C1A06E]">
            <Handshake className="h-4 w-4" />
            Off-Plan Developers
          </span>
        }
      />

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
