"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import ServiceCard from "@/components/services/ServiceCard";
import type { Service } from "@/types/service";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
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
      } catch {
        // Section stays hidden when empty
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, services.length - cardsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));

  if (loading) {
    return (
      <section className="overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#C1A06E]" />
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center lg:mx-auto">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a88b5e] sm:text-sm">
            What We Offer
          </h3>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
            Our Premium Real Estate Services in Dubai
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Property sales, leasing, valuation, investment advisory, and
            management — with clear guidance for buyers, sellers, and investors.
          </p>
        </div>

        <div className="mt-8 w-full sm:mt-10">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
              }}
            >
              {services.map((service) => (
                <div
                  key={service._id}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          </div>

          {maxIndex > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous services"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-7 bg-[#C1A06E]"
                        : "w-2 bg-slate-300"
                    }`}
                    aria-label={`Go to services slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={currentIndex >= maxIndex}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next services"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Button
            asChild
            className="flex items-center gap-2 bg-secondary px-6 py-5 text-sm font-medium hover:bg-primary-dark-muted sm:px-8"
          >
            <Link href="/services">
              View all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
