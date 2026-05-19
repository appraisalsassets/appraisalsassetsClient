"use client";

import { motion } from "framer-motion";

export type TrustedPartnerItem = {
  _id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
};

type TrustedPartnerLogoCardProps = {
  partner: TrustedPartnerItem;
  index?: number;
};

export default function TrustedPartnerLogoCard({
  partner,
  index = 0,
}: TrustedPartnerLogoCardProps) {
  const website = partner.websiteUrl?.trim();
  const content = (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:border-[#C1A06E]/30 hover:shadow-md"
    >
      <motion.div
        className="flex w-full flex-1 items-center justify-center px-2 py-4"
        whileHover={website ? { scale: 1.02 } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-24 w-full max-w-[220px] object-contain"
        />
      </motion.div>
      {partner.name ? (
        <p className="mt-3 text-center text-sm font-medium text-slate-600">
          {partner.name}
        </p>
      ) : null}
    </motion.article>
  );

  if (website) {
    return (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        title={partner.name}
      >
        {content}
      </a>
    );
  }

  return content;
}
