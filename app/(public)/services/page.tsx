"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";
import ServiceCard from "@/components/services/ServiceCard";
import type { Service } from "@/types/service";

export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await api.getServices();
        if (response.success) {
          const list = (response.services || []) as Service[];
          list.sort(
            (a, b) =>
              (a.displayOrder ?? 0) - (b.displayOrder ?? 0) ||
              a.name.localeCompare(b.name),
          );
          setServices(list);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pb-14 md:mt-28 lg:mt-36 mt-36">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#a88b5e]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a88b5e] sm:text-sm">
            Our services
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Premium Real Estate Services in Dubai
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Property sales, leasing, valuation, investment advisory, and
            management — delivered with clear guidance for every client.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#C1A06E]" />
          </div>
        ) : services.length === 0 ? (
          <div className="mt-16 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <p className="text-slate-600">
              Services will appear here once added in admin.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
