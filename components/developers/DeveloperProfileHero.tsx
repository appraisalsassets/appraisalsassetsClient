"use client";

import { useState } from "react";
import DeveloperBreadcrumbs from "@/components/developers/DeveloperBreadcrumbs";
import { Building2 } from "lucide-react";
import {
  isValidPropertyImageUrl,
  resolvePropertyImageUrl,
} from "@/lib/propertyImages";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DeveloperProfileHeroProps = {
  name: string;
  summary?: string;
  logo?: string;
  heroImage?: string;
  breadcrumbs: BreadcrumbItem[];
};

export default function DeveloperProfileHero({
  name,
  summary,
  logo,
  heroImage,
  breadcrumbs,
}: DeveloperProfileHeroProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  const bgImage =
    heroImage && isValidPropertyImageUrl(heroImage)
      ? resolvePropertyImageUrl(heroImage)
      : "";
  const logoSrc =
    logo && isValidPropertyImageUrl(logo) ? resolvePropertyImageUrl(logo) : "";
  const showLogoImage = Boolean(logoSrc) && !logoFailed;

  return (
    <section className="relative min-h-[580px] overflow-hidden bg-primary-dark sm:min-h-[640px] lg:min-h-[720px]">
      <div className="absolute inset-0">
        {bgImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgImage}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-[#2a2520] via-primary-dark to-slate-950" />
        )}
        <div
          className="absolute inset-0 bg-linear-to-r from-black/85 via-black/70 to-black/50"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-black/40"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#C1A06E]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[580px] max-w-7xl flex-col justify-center px-4 py-16 pt-32 sm:min-h-[640px] sm:px-6 sm:py-20 sm:pt-36 lg:min-h-[720px] lg:px-8 lg:py-24 lg:pt-40">
        {/* Logo on white panel — same approach as developers listing cards */}
        <div className="mb-10 inline-flex w-fit max-w-full items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-8 py-6 shadow-xl sm:mb-12 sm:min-h-[120px] sm:min-w-[240px] sm:px-10 sm:py-8">
          {showLogoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={`${name} logo`}
              className="max-h-16 w-auto max-w-[260px] object-contain sm:max-h-20 lg:max-h-24"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="flex min-h-[72px] min-w-[160px] flex-col items-center justify-center gap-2 text-slate-500 sm:min-h-[88px]">
              <Building2 className="h-10 w-10 text-[#C1A06E] sm:h-12 sm:w-12" />
              <span className="text-center text-sm font-semibold text-primary-dark sm:text-base">
                {name}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C1A06E] sm:text-sm">
          Off-Plan Developer
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
          {name}
        </h1>
        {summary ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:mt-5 sm:text-lg md:text-xl">
            {summary}
          </p>
        ) : null}

        <DeveloperBreadcrumbs light className="mt-8 sm:mt-10" items={breadcrumbs} />
      </div>
    </section>
  );
}
