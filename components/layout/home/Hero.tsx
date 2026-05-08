"use client";

import { ANALYTICS } from "@/constants/constants";
import Filter from "./Filter";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function Hero() {
  const [content, setContent] = useState({
    badgeText: "Trusted property intelligence for Dubai investors",
    headline: "Modern property advisory powered by data, clarity, and speed.",
    description:
      "Assets & Appraisals brings together real estate market insights, valuation intelligence, and responsive advisory for teams that need to move faster and make smarter decisions.",
  });

  useEffect(() => {
    api
      .getSiteContent()
      .then((res) => {
        if (res.success && res.data?.hero) {
          setContent((prev) => ({
            badgeText: res.data.hero.badgeText || prev.badgeText,
            headline: res.data.hero.headline || prev.headline,
            description: res.data.hero.description || prev.description,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const features = [
    {
      title: "Real-time market clarity",
      description:
        "Live Dubai property insights and valuations for faster decisions.",
    },
    {
      title: "Tailored investment support",
      description: "Advisory and asset strategies built around your goals.",
    },
    {
      title: "Data-driven strategy",
      description:
        "Practical recommendations informed by market trends and local demand.",
    },
    {
      title: "Transparent execution",
      description:
        "Clear next steps, streamlined communication, and trusted guidance.",
    },
  ];

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
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <span className="inline-flex max-w-full items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-medium text-primary sm:px-4 sm:text-sm">
              {content.badgeText}
            </span>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {content.headline}
              </h1>

              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {content.description}
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <div className="w-full overflow-hidden rounded-3xl">
                <Filter />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <button className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90 sm:w-auto">
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>

                <button className="inline-flex w-full items-center justify-center rounded-full border border-slate-200/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto">
                  Contact an Advisor
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl sm:rounded-3xl sm:p-6"
              >
                <p className="text-base font-semibold text-white">
                  {feature.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-3">
          {ANALYTICS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center shadow-lg shadow-slate-950/10 sm:rounded-3xl sm:p-6"
            >
              <p className="text-2xl font-semibold text-primary sm:text-3xl">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
