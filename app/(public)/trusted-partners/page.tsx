"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Handshake, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import TrustedPartnerLogoCard, {
  type TrustedPartnerItem,
} from "@/components/trusted-partners/TrustedPartnerLogoCard";

export default function TrustedPartnersPage() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<TrustedPartnerItem[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const response = await api.getTrustedPartners();
        if (response.success && Array.isArray(response.partners)) {
          const list = response.partners as TrustedPartnerItem[];
          list.sort(
            (a, b) =>
              ((a as { displayOrder?: number }).displayOrder ?? 0) -
                ((b as { displayOrder?: number }).displayOrder ?? 0) ||
              a.name.localeCompare(b.name),
          );
          setPartners(list);
        }
      } catch (error) {
        console.error("Failed to fetch trusted partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 md:mt-24 lg:mt-32 sm:mt-16 mt-32">
        <p className="mb-8 text-sm text-slate-600">
          {loading
            ? "Loading partners…"
            : `${partners.length} partner${partners.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#C1A06E]" />
            <p>Loading trusted partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <Handshake className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              No partner logos yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-slate-600">
              Partner logos will appear here once they are added in the admin
              panel under Trusted Partners.
            </p>
            <Link href="/developers" className="mt-6 inline-block">
              <Button
                variant="outline"
                className="border-[#C1A06E] text-[#a88b5e] hover:bg-[#C1A06E]/10"
              >
                View Off-Plan Developers
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {partners.map((partner, index) => (
              <TrustedPartnerLogoCard
                key={partner._id}
                partner={partner}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
