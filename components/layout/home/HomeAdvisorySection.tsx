"use client";

import { BarChart3, Handshake, LineChart, Sparkles } from "lucide-react";

const ITEMS = [
  {
    title: "Real-time market clarity",
    description:
      "Live Dubai property insights and valuations for faster decisions.",
    icon: BarChart3,
  },
  {
    title: "Tailored investment support",
    description: "Advisory and asset strategies built around your goals.",
    icon: Handshake,
  },
  {
    title: "Data-driven strategy",
    description:
      "Practical recommendations informed by market trends and local demand.",
    icon: LineChart,
  },
  {
    title: "Transparent execution",
    description:
      "Clear next steps, streamlined communication, and trusted guidance.",
    icon: Sparkles,
  },
];

export default function HomeAdvisorySection() {
  return (
    <section className="bg-slate-50 py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#C1A06E]/35 hover:shadow-md sm:rounded-2xl sm:p-6"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#C1A06E]/10 text-[#a88b5e] group-hover:bg-[#C1A06E] group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-primary-dark sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
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
