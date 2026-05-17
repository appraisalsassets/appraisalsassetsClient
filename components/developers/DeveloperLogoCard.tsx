"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

export type DeveloperLogoCardData = {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
};

type DeveloperLogoCardProps = {
  developer: DeveloperLogoCardData;
  index?: number;
};

export default function DeveloperLogoCard({
  developer,
  index = 0,
}: DeveloperLogoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:border-[#C1A06E]/30 hover:shadow-md"
    >
      <Link
        href={`/developers/${developer.slug}`}
        className="flex flex-1 flex-col p-5 sm:p-6"
      >
        <div className="flex min-h-[140px] flex-1 items-center justify-center rounded-lg border border-slate-100 bg-white px-4 py-6">
          {developer.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={developer.logo}
              alt={developer.name}
              className="max-h-20 w-full max-w-[200px] object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Building2 className="h-10 w-10" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Logo coming soon
              </span>
            </div>
          )}
        </div>
        <h2 className="mt-5 text-center text-base font-semibold text-primary-dark sm:text-lg">
          {developer.name}
        </h2>
      </Link>
      <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6">
        <Link
          href={`/developers/${developer.slug}`}
          className="flex w-full items-center justify-center rounded-md border-2 border-[#C1A06E] px-4 py-2.5 text-sm font-semibold text-[#a88b5e] transition-colors hover:bg-[#C1A06E] hover:text-white"
        >
          View Profile
        </Link>
      </div>
    </motion.article>
  );
}
