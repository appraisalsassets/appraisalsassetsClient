"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  FileSearch,
  Handshake,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

type Service = {
  title: string;
  description: string;
  features: string[];
  Icon: LucideIcon;
};

const SERVICES: Service[] = [
  {
    title: "Property Sales",
    description:
      "Buy and sell residential and commercial property in Dubai with market insight and transaction support.",
    features: [
      "Market Analysis",
      "Property search and shortlisting",
      "Price Negotiation",
      "Legal Support",
    ],
    Icon: Building2,
  },
  {
    title: "Investment Advisory",
    description:
      "Assess opportunities, improve returns, and build stronger property portfolios in Dubai.",
    features: [
      "ROI Analysis",
      "Portfolio Management",
      "Market Insights",
      "Investment strategy support",
    ],
    Icon: ChartNoAxesCombined,
  },
  {
    title: "Property Valuation",
    description:
      "Structured valuation guidance for sale, purchase, leasing, or investment review.",
    features: [
      "Property appraisal support",
      "Market Comparisons",
      "Asset Assessment",
      "Valuation reporting guidance",
    ],
    Icon: FileSearch,
  },
  {
    title: "Property Management",
    description:
      "Manage residential and commercial assets with support for tenants and long-term value.",
    features: [
      "Tenant Screening",
      "Maintenance coordination",
      "Rent Collection",
      "Ongoing management support",
    ],
    Icon: Handshake,
  },
  {
    title: "Lease Property",
    description:
      "Leasing solutions to attract suitable tenants and streamline rental marketing and documentation.",
    features: [
      "Tenant Screening",
      "Lease Documentation",
      "Rental Marketing",
      "Contract Negotiation",
    ],
    Icon: KeyRound,
  },
];

function ServiceCard({ service }: { service: Service }) {
  const { Icon } = service;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#C1A06E]/50 hover:shadow-lg sm:p-6">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C1A06E]/10 text-[#a88b5e] transition-colors group-hover:bg-[#C1A06E] group-hover:text-white">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug text-slate-900 group-hover:text-[#a88b5e] sm:text-lg">
          {service.title}
        </h3>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {service.description}
      </p>

      <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        {service.features.map((feat) => (
          <li
            key={feat}
            className="flex items-start gap-2 text-xs leading-5 text-slate-600 sm:text-sm"
          >
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C1A06E]" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

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

  const maxIndex = Math.max(0, SERVICES.length - cardsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));

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
              {SERVICES.map((service) => (
                <div
                  key={service.title}
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
          <Button className="flex items-center gap-2 bg-secondary px-6 py-5 text-sm font-medium hover:bg-primary-dark-muted sm:px-8">
            Get Expert Consultation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
