"use client";

import Image from "next/image";
import { Award, Clock, Shield, Users, type LucideIcon } from "lucide-react";

type Feature = {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    id: "rera-certified",
    title: "RERA Certified",
    description:
      "Licensed real estate operations in Dubai for buying, selling, leasing, and property management.",
    Icon: Shield,
  },
  {
    id: "experienced-team",
    title: "Experienced Team",
    description:
      "Professionals with deep knowledge of Dubai residential, commercial, and investment markets.",
    Icon: Users,
  },
  {
    id: "trusted-2010",
    title: "Trusted Since 2010",
    description:
      "Over a decade of reliable guidance, structured service, and long-term client support.",
    Icon: Award,
  },
  {
    id: "15-years-excellence",
    title: "15+ Years of Excellence",
    description:
      "A proven track record built on experience, service quality, and practical expertise.",
    Icon: Award,
  },
  {
    id: "end-to-end",
    title: "End-to-End Support",
    description:
      "Sales, valuation, advisory, leasing, and management with clear direction at every step.",
    Icon: Clock,
  },
  {
    id: "local-expertise",
    title: "Local Market Expertise",
    description:
      "Neighborhood-level insight to help buyers, sellers, and investors decide with confidence.",
    Icon: Shield,
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const { Icon } = feature;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-[#C1A06E]/30 hover:bg-white/[0.08] sm:p-6">
      <div className="flex items-center gap-3.5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C1A06E]/15 text-[#C1A06E] ring-1 ring-[#C1A06E]/20"
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h4 className="min-w-0 flex-1 text-base font-semibold leading-snug text-white">
          {feature.title}
        </h4>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        {feature.description}
      </p>
    </article>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-secondary py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className="w-full min-w-0">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm md:text-base">
                Why Choose Us
              </h3>

              <h2 className="break-words text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl xl:text-6xl">
                Why Clients Choose
                <span className="block text-[#C1A06E]">Assets & Appraisals</span>
              </h2>

              <p className="max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8 lg:text-lg">
                <b>Assets & Appraisals</b> brings over 15 years of experience
                in Dubai real estate, helping buyers, sellers, investors,
                landlords, and businesses make better property decisions.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-10">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"
                alt="Modern luxury living room"
                width={1200}
                height={800}
                priority
                className="h-[260px] w-full object-cover sm:h-[400px] md:h-[500px] lg:h-[600px]"
              />
            </div>

            <div className="relative mx-auto mt-5 flex w-full max-w-[240px] items-center gap-4 rounded-2xl bg-white p-4 shadow-2xl sm:max-w-[260px] md:max-w-[280px] lg:absolute lg:-bottom-8 lg:left-6 lg:mt-0 xl:-bottom-10 xl:left-8">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white sm:h-16 sm:w-16 sm:text-xl">
                15+
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Years
                </h4>
                <p className="text-sm text-slate-600 sm:text-base">
                  of Excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
