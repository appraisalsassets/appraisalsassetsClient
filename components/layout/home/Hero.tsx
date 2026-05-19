"use client";

import { ANALYTICS } from "@/constants/constants";
import Filter from "./Filter";
import HomeHeroInquiryForm from "./HomeHeroInquiryForm";
import { ArrowRight, Award, Building2, HandCoins, Smile } from "lucide-react";
import Link from "next/link";

const STAT_ICONS = [Award, Building2, HandCoins, Smile];

const HOME_HERO_CONTENT = {
  badgeText: "RERA Certified | Trusted Since 2010",
  headline: "Best Real Estate Agency in Dubai",
  description:
    "Trusted Real Estate Company & Property Experts. Assets & Appraisal is a leading real estate agency in Dubai and trusted real estate company, recognized among the top real estate companies in Dubai for delivering complete real estate services in Dubai across residential and commercial sectors.",
};

export default function Hero() {
  const scrollToInquiry = () => {
    document
      .getElementById("hero-inquiry-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000")',
        }}
      />
      <div className="absolute inset-0 bg-slate-950/90" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <span className="inline-flex max-w-full items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-medium text-primary sm:px-4 sm:text-sm">
              {HOME_HERO_CONTENT.badgeText}
            </span>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {HOME_HERO_CONTENT.headline}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {HOME_HERO_CONTENT.description}
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div className="w-full overflow-hidden rounded-3xl">
                <Filter />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/properties"
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90 sm:w-auto"
                >
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={scrollToInquiry}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto"
                >
                  Contact an Advisor
                </button>
              </div>
            </div>
          </div>

          <HomeHeroInquiryForm />
        </div>

        {/* Stats stay in hero — wider cards, better UI */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 xl:grid-cols-4">
          {ANALYTICS.map((item, index) => {
            const Icon = STAT_ICONS[index] ?? Award;
            return (
              <article
                key={item.description}
                className="group flex min-h-[108px] flex-col items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-5 text-center shadow-lg backdrop-blur-md transition hover:border-[#C1A06E]/40 hover:bg-white/[0.14] sm:min-h-[112px] sm:rounded-2xl sm:px-5 sm:py-5"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#C1A06E]/15 text-[#C1A06E] ring-1 ring-[#C1A06E]/25 group-hover:bg-[#C1A06E] group-hover:text-slate-950">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <p className="text-xl font-bold text-[#C1A06E] sm:text-2xl">
                  {item.title}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-300 sm:text-sm">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
