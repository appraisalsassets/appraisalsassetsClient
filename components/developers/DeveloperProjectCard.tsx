"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Maximize, Home, MessageCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { normalizePropertyImageUrls } from "@/lib/propertyImages";

interface DeveloperProject {
  _id: string;
  title: string;
  description: string;
  developerId: string;
  developerName: string;
  developerSlug: string;
  location: string;
  propertyType: string;
  price: { amount: number; currency: string };
  sizeFrom: number;
  sizeTo: number;
  bedroomsFrom?: number;
  bedroomsTo?: number;
  status: string;
  images: string[];
  featured: boolean;
  phone?: string;
  whatsAppNumber?: string;
  contactEmail?: string;
}

interface DeveloperProjectCardProps {
  project: DeveloperProject;
  index?: number;
  viewMode?: "grid" | "list";
  detailHref?: string;
}

const statusBadgeStyles: Record<string, { label: string; className: string }> = {
  available: { label: "AVAILABLE", className: "bg-[#C1A06E]" },
  upcoming: { label: "NEW LAUNCH", className: "bg-[#C1A06E]" },
  under_construction: { label: "UNDER CONSTRUCTION", className: "bg-orange-500" },
  sold_out: { label: "SOLD OUT", className: "bg-red-600" },
  sold: { label: "SOLD", className: "bg-red-600" },
  rented: { label: "RENTED", className: "bg-slate-600" },
  reserved: { label: "RESERVED", className: "bg-amber-600" },
};

const propertyTypeLabels: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  townhouse: "Townhouse",
  penthouse: "Penthouse",
  office: "Office",
  retail: "Retail",
  mixed: "Mixed Use",
};

function formatLocationLabel(location: string) {
  return location.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBedroomsLabel(from?: number, to?: number) {
  if (from == null && to == null) return null;
  if (from != null && to != null && from !== to) return `${from} - ${to} BR`;
  const value = from ?? to;
  return value === 0 ? "Studio" : `${value} BR`;
}

export default function DeveloperProjectCard({
  project,
  index = 0,
  viewMode = "grid",
  detailHref,
}: DeveloperProjectCardProps) {
  const href =
    detailHref || `/developers/${project.developerSlug}/projects/${project._id}`;
  const coverImage = normalizePropertyImageUrls(project.images)[0] || "";
  const [coverFailed, setCoverFailed] = React.useState(false);
  const statusBadge = statusBadgeStyles[project.status] || statusBadgeStyles.available;
  const bedroomLabel = formatBedroomsLabel(project.bedroomsFrom, project.bedroomsTo);
  const sizeLabel =
    project.sizeFrom && project.sizeTo && project.sizeFrom !== project.sizeTo
      ? `${project.sizeFrom.toLocaleString()} to ${project.sizeTo.toLocaleString()} SQ. FT.`
      : `${(project.sizeFrom || project.sizeTo || 0).toLocaleString()} SQ. FT.`;

  const onWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = project.whatsAppNumber || project.phone || "+971501234567";
    const text = encodeURIComponent(`Hi! I'm interested in: ${project.title}`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  const onEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const email = project.contactEmail || "info@example.com";
    const subject = encodeURIComponent(`Inquiry about ${project.title}`);
    const body = encodeURIComponent(`I would like more information about ${project.title}.`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  };

  const imageBlock = (
    <div className="relative overflow-hidden bg-slate-100">
      {coverImage && !coverFailed ? (
        <img
          src={coverImage}
          alt={project.title}
          className="h-full w-full object-cover"
          onError={() => setCoverFailed(true)}
        />
      ) : (
        <div className="flex h-full min-h-[200px] items-center justify-center text-slate-400">
          <Home className="h-12 w-12" />
        </div>
      )}
      <span
        className={`absolute right-3 top-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase text-white ${statusBadge.className}`}
      >
        {statusBadge.label}
      </span>
    </div>
  );

  const bodyBlock = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {(propertyTypeLabels[project.propertyType] || project.propertyType).toUpperCase()}
      </p>
      <p className="mt-1 text-xl font-bold text-[#C1A06E]">
        {project.price.currency} {project.price.amount.toLocaleString()}
      </p>
      <Link href={href}>
        <h3 className="mt-3 line-clamp-2 text-base font-bold text-slate-900 hover:text-[#C1A06E] sm:text-lg">
          {project.title}
        </h3>
      </Link>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
        {formatLocationLabel(String(project.location))}
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
        {bedroomLabel ? (
          <span className="inline-flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-[#C1A06E]" />
            {bedroomLabel}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5">
          <Maximize className="h-4 w-4 text-[#C1A06E]" />
          {sizeLabel}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button
          type="button"
          onClick={onWhatsApp}
          className="h-10 bg-green-50 text-green-800 hover:bg-green-100"
        >
          <MessageCircle className="mr-1.5 h-4 w-4" />
          WhatsApp
        </Button>
        <Button type="button" onClick={onEmail} className="h-10 bg-amber-50 text-slate-900 hover:bg-amber-100">
          <Mail className="mr-1.5 h-4 w-4" />
          Email
        </Button>
      </div>
    </>
  );

  if (viewMode === "list") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
        <Card className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row">
            <Link href={href} className="block w-full md:w-80">
              <div className="relative h-56 md:min-h-[240px]">{imageBlock}</div>
            </Link>
            <div className="flex flex-1 flex-col p-6">{bodyBlock}</div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
      <Card className="group h-full overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-lg">
        <Link href={href} className="block aspect-[4/3]">
          {imageBlock}
        </Link>
        <div className="p-4 sm:p-5">{bodyBlock}</div>
      </Card>
    </motion.div>
  );
}
