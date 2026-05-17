"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Home,
  MessageCircle,
  Mail,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

interface DeveloperProject {
  _id: string;
  title: string;
  description: string;
  developerId: string;
  developerName: string;
  developerSlug: string;
  location: string;
  propertyType: string;
  price: {
    amount: number;
    currency: string;
  };
  sizeFrom: number;
  sizeTo: number;
  bedroomsFrom?: number;
  bedroomsTo?: number;
  status: string;
  images: string[];
  featured: boolean;
  completionDate?: string;
  handoverDate?: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

interface DeveloperProjectCardProps {
  project: DeveloperProject;
  index?: number;
  viewMode?: "grid" | "list";
  /** When set, card links here (e.g. /properties/id for Property documents) */
  detailHref?: string;
}

const statusColors: Record<string, string> = {
  available: "bg-green-500",
  upcoming: "bg-blue-500",
  sold_out: "bg-red-500",
  sold: "bg-red-500",
  rented: "bg-slate-500",
  reserved: "bg-amber-500",
  under_construction: "bg-yellow-500",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  upcoming: "Upcoming",
  sold_out: "Sold Out",
  sold: "Sold",
  rented: "Rented",
  reserved: "Reserved",
  under_construction: "Under Construction",
};

const propertyTypeLabels: Record<string, string> = {
  apartment: "Apartments",
  villa: "Villas",
  townhouse: "Townhouses",
  penthouse: "Penthouses",
  office: "Offices",
  retail: "Retail",
  mixed: "Mixed Use",
};

export default function DeveloperProjectCard({
  project,
  index = 0,
  viewMode = "grid",
  detailHref,
}: DeveloperProjectCardProps) {
  const href =
    detailHref ||
    `/developers/${project.developerSlug}/projects/${project._id}`;
  const coverImage = project.images[0] || "";

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const phoneNumber = "+971501234567"; // Default number for developer projects
    const message = encodeURIComponent(
      `Hi! I'm interested in this project:\n\n🏠 *${project.title}*\n🏢 Developer: ${project.developerName}\n💰 Starting from: ${project.price.currency} ${project.price.amount.toLocaleString()}\n📍 Location: ${project.location}\n📐 Size: ${project.sizeFrom} - ${project.sizeTo} sqft${project.bedroomsFrom ? `\n🛏️ Bedrooms: ${project.bedroomsFrom}${project.bedroomsTo ? ` - ${project.bedroomsTo}` : ""}` : ""}\n\nI would like to know more details about this project.`,
    );

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const subject = encodeURIComponent(`Inquiry about ${project.title}`);
    const body = encodeURIComponent(
      `Hi! I'm interested in this project:\n\nProject Title: ${project.title}\nDeveloper: ${project.developerName}\nLocation: ${project.location}\nPrice: Starting from ${project.price.currency} ${project.price.amount.toLocaleString()}\nSize: ${project.sizeFrom} - ${project.sizeTo} sqft${project.bedroomsFrom ? `\nBedrooms: ${project.bedroomsFrom}${project.bedroomsTo ? ` - ${project.bedroomsTo}` : ""}` : ""}\n\nI would like to know more details about this project.\n\nPlease contact me with more information.`,
    );

    const mailtoUrl = `mailto:info@example.com?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, "_blank");
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link href={href}>
          <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-80 h-56 md:h-auto shrink-0">
                <img
                  src={coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge
                  className={`absolute top-4 left-4 ${statusColors[project.status]} text-white border-0`}
                >
                  {statusLabels[project.status]}
                </Badge>
                {project.featured && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 text-white border-0">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-primary-dark group-hover:text-[#C1A06E] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#C1A06E] font-medium">
                      {project.developerName}
                    </p>
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 text-[#C1A06E]" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#C1A06E]">
                      {project.price.currency}{" "}
                      {project.price.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Starting from</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {project.description}
                </p>

                <div className="flex items-center gap-6 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5" />
                    <span>
                      {project.sizeFrom} - {project.sizeTo} sqft
                    </span>
                  </div>
                  {project.bedroomsFrom && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      <span>
                        {project.bedroomsFrom}
                        {project.bedroomsTo
                          ? ` - ${project.bedroomsTo}`
                          : ""}{" "}
                        Beds
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    <span>
                      {propertyTypeLabels[project.propertyType] ||
                        project.propertyType}
                    </span>
                  </div>
                </div>

                {(project.completionDate || project.handoverDate) && (
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {project.completionDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Complete:{" "}
                          {new Date(
                            project.completionDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {project.handoverDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Handover:{" "}
                          {new Date(project.handoverDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleWhatsAppClick}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={handleEmailClick}
                    size="sm"
                    variant="outline"
                    className="border-slate-200 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={href}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
          <div className="relative h-64 overflow-hidden">
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            <Badge
              className={`absolute top-4 left-4 ${statusColors[project.status]} text-white border-0`}
            >
              {statusLabels[project.status]}
            </Badge>

            {project.featured && (
              <Badge className="absolute top-4 right-4 bg-amber-500 text-white border-0">
                Featured
              </Badge>
            )}

            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-2xl font-bold text-white">
                {project.price.currency} {project.price.amount.toLocaleString()}
              </p>
              <p className="text-sm text-white/80">Starting from</p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-primary-dark line-clamp-1 group-hover:text-[#C1A06E] transition-colors">
                {project.title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {propertyTypeLabels[project.propertyType] ||
                  project.propertyType}
              </Badge>
            </div>

            <p className="text-sm text-[#C1A06E] font-medium mb-2">
              {project.developerName}
            </p>

            <div className="flex items-center gap-1 text-gray-500 mb-3">
              <MapPin className="w-4 h-4 text-[#C1A06E]" />
              <span className="text-sm">{project.location}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
              <div>
                <span>
                  {project.sizeFrom} - {project.sizeTo} sqft
                </span>
              </div>
              {project.bedroomsFrom && (
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>
                    {project.bedroomsFrom}
                      {project.bedroomsTo
                        ? ` - ${project.bedroomsTo}`
                        : ""}{" "}
                      Beds
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span>
                  {propertyTypeLabels[project.propertyType] ||
                    project.propertyType}
                </span>
              </div>
            </div>

              {(project.completionDate || project.handoverDate) && (
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {project.completionDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Complete:{" "}
                        {new Date(
                          project.completionDate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.handoverDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Handover:{" "}
                        {new Date(project.handoverDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleWhatsAppClick}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleEmailClick}
                  size="sm"
                  variant="outline"
                  className="border-slate-200 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
