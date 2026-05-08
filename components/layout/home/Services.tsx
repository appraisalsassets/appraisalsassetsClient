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
} from "lucide-react";

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  const services = [
    {
      title: "Property Sales",
      description:
        "Assets & Appraisals helps clients buy and sell residential and commercial property in Dubai with practical support at every stage. Our team provides market insight, property guidance, and transaction support to help clients move forward with more confidence.",
      features: [
        "Market Analysis",
        "Property search and shortlisting",
        "Price Negotiation",
        "Legal Support",
      ],
      icon: <Building2 className="h-7 w-7 sm:h-8 sm:w-8" />,
    },
    {
      title: "Investment Advisory",
      description:
        "Assets & Appraisals offers investment advisory services for clients who want to assess opportunities, improve returns, and build stronger property portfolios in Dubai. We focus on market trends, asset performance, and long-term investment goals.",
      features: [
        "ROI Analysis",
        "Portfolio Management",
        "Market Insights",
        "Investment strategy support",
      ],
      icon: <ChartNoAxesCombined className="h-7 w-7 sm:h-8 sm:w-8" />,
    },
    {
      title: "Property Valuation",
      description:
        "Assets & Appraisals provides property valuation and appraisal support for clients who need a clearer understanding of market value. Whether the purpose is sale, purchase, leasing, or investment review, our team delivers structured valuation guidance supported by market comparisons.",
      features: [
        "Property appraisal support",
        "Market Comparisons",
        "Asset Assessment",
        "Valuation reporting guidance",
      ],
      icon: <FileSearch className="h-7 w-7 sm:h-8 sm:w-8" />,
    },
    {
      title: "Property Management",
      description:
        "Assets & Appraisals helps landlords and investors manage residential and commercial property more effectively. Our property management services are designed to support tenant retention, reduce operational stress, and protect long-term asset value.",
      features: [
        "Tenant Screening",
        "Maintenance coordination",
        "Rent Collection",
        "Ongoing management support",
      ],
      icon: <Handshake className="h-7 w-7 sm:h-8 sm:w-8" />,
    },
    {
      title: "Lease Property",
      description:
        "Assets & Appraisals supports property owners with leasing solutions designed to attract suitable tenants and improve occupancy. From rental marketing to lease documentation, we manage the process with a clear and practical approach.",
      features: [
        "Tenant Screening",
        "Lease Documentation",
        "Rental Marketing",
        "Contract Negotiation",
      ],
      icon: <KeyRound className="h-7 w-7 sm:h-8 sm:w-8" />,
    },
  ];

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerView(4);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();

    window.addEventListener("resize", updateCardsPerView);

    return () =>
      window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, services.length - cardsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <section className="my-8 overflow-hidden bg-white py-10 sm:my-10 sm:py-14 md:my-12 md:py-16 lg:py-20 xl:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 text-base font-medium sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl text-center">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
            What We Offer
          </h3>

          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Our Premium Real Estate Services in Dubai
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 lg:text-lg">
            Assets & Appraisals provides real estate services in Dubai for
            buyers, sellers, investors, landlords, and businesses. From
            property sales and leasing to valuation, investment advisory, and
            property management, Assets & Appraisals helps clients make informed
            property decisions with clear guidance and market insight.
          </p>
        </div>

        {/* Slider */}
        <div className="mt-8 w-full sm:mt-10 lg:mt-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  (currentIndex * 100) / cardsPerView
                }%)`,
              }}
            >
              {services.map((sr) => (
                <div
                  key={sr.title}
                  className="shrink-0 px-2 sm:px-3"
                  style={{
                    width: `${100 / cardsPerView}%`,
                  }}
                >
                  <div className="group flex h-full min-h-[520px] flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-primary/70 hover:shadow-2xl sm:min-h-[540px] sm:p-6 lg:min-h-[560px] xl:min-h-[580px]">
                    {/* Icon */}
                    <div className="mb-5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white sm:h-14 sm:w-14">
                      {sr.icon}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-primary sm:text-xl">
                        {sr.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-[15px]">
                        {sr.description}
                      </p>

                      {/* Features */}
                      <ul className="mt-5 space-y-3">
                        {sr.features.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-start gap-2 text-sm text-gray-600 sm:text-[15px]"
                          >
                            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {maxIndex > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                        ? "w-7 bg-primary"
                        : "w-2 bg-gray-300"
                    }`}
                    aria-label={`Go to services slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={currentIndex >= maxIndex}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next services"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-10">
          <Button className="flex w-full items-center justify-center gap-2 bg-secondary px-6 py-6 text-sm font-medium hover:bg-primary-dark-muted sm:w-auto sm:px-8">
            Get Expert Consultation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
