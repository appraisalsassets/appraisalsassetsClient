"use client";

import Image from "next/image";
import { Award, Clock, Shield, Users } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      id: "rera-certified",
      title: "RERA Certified",
      description:
        "Assets & Appraisals operates as a licensed real estate company in Dubai, giving clients added confidence when buying, selling, leasing, or managing property.",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "experienced-team",
      title: "Experienced Team",
      description:
        "Our team includes experienced real estate professionals with strong knowledge of Dubai’s residential, commercial, and investment property market.",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "trusted-2010",
      title: "Trusted Since 2010",
      description:
        "For more than a decade, Assets & Appraisals has supported clients with reliable real estate guidance, structured service, and long-term property support.",
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: "15-years-excellence",
      title: "15+ Years of Excellence",
      description:
        "A strong track record in Dubai real estate built on experience, service quality, and practical property expertise.",
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: "end-to-end",
      title: "End-to-End Support",
      description:
        "From property search and sales to valuation, leasing, and management, we help clients move through each stage with clearer direction and better market insight.",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "local-expertise",
      title: "Local Market Expertise",
      description:
        "Deep knowledge of Dubai's diverse neighborhoods ensures optimal property decisions for buyers, sellers, and investors.",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-secondary py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* LEFT CONTENT */}
          <div className="w-full min-w-0">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm md:text-base">
                Why Choose Us
              </h3>

              <h2 className="break-words text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl xl:text-6xl">
                Why Clients Choose
                <span className="block text-[#C1A06E]">
                  Assets & Appraisals
                </span>
              </h2>

              <p className="max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8 lg:text-lg">
                <b>Assets & Appraisals</b> brings over 15 years of experience
                in Dubai real estate, helping buyers, sellers, investors,
                landlords, and businesses make better property decisions. Our
                team combines local market knowledge with practical support
                across property sales, valuation, advisory, leasing, and
                management services in Dubai.
              </p>
            </div>

            {/* FEATURES */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-10">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:bg-white/10 sm:p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary sm:h-12 sm:w-12">
                    {feature.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-white sm:text-base">
                      {feature.title}
                    </h4>

                    <p className="mt-1 text-xs leading-6 text-gray-300 sm:text-sm sm:leading-7">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
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

            {/* FLOATING CARD */}
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
