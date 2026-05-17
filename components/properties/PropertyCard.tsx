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
  Heart,
  Eye,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const locationLabels: Record<string, string> = {
  dubai_marina: "Dubai Marina",
  downtown_dubai: "Downtown Dubai",
  bussiness_bay: "Business Bay",
  jvc: "JVC",
  palm_jumeirah: "Palm Jumeirah",
  dubai_hills: "Dubai Hills",
  arabian_ranches: "Arabian Ranches",
  emaar_beachfront: "Emaar Beachfront",
  blue_waters: "Bluewaters",
  city_walks: "City Walk",
};

const categoryLabels: Record<string, string> = {
  for_sale: "For Sale",
  for_rent: "For Rent",
  off_plan: "Off-Plan",
  commercial: "Commercial",
};

const categoryColors: Record<string, string> = {
  for_sale: "bg-emerald-500",
  for_rent: "bg-blue-500",
  off_plan: "bg-[#C1A06E]",
  commercial: "bg-purple-500",
};

interface Property {
  _id: string;
  title: string;
  description: string;
  category: string;
  propertyType: string;
  status: string;
  price: {
    amount: number;
    currency: string;
  };
  sizeSqft: number;
  referenceNumber: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: Array<{
    url: string;
    isCover: boolean;
  }>;
  location: string;
  phone: string;
  whatsAppNumber: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PropertyCardProps {
  property: Property;
  index?: number;
  viewMode?: "grid" | "list";
}

export default function PropertyCard({
  property,
  index = 0,
  viewMode = "grid",
}: PropertyCardProps) {
  const coverImage =
    property.images.find((img) => img.isCover)?.url || property.images[0]?.url;
  const imageUrl = coverImage || "";

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const phoneNumber = property.whatsAppNumber || property.phone;
    if (!phoneNumber) {
      console.warn("No phone number available for WhatsApp contact");
      return;
    }

    const message = encodeURIComponent(
      `Hi! I'm interested in the property: ${property.title} (Ref: ${property.referenceNumber})`,
    );

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link href={`/properties/${property._id}`}>
          <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-80 h-64 md:min-h-[280px] md:h-auto shrink-0">
                <img
                  src={imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge
                  className={`absolute top-4 left-4 ${categoryColors[property.category]} text-white border-0`}
                >
                  {categoryLabels[property.category]}
                </Badge>
                {property.isFeatured && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 text-white border-0">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-primary-dark group-hover:text-[#C1A06E] transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 text-[#C1A06E]" />
                      <span className="text-sm">
                        {locationLabels[property.location] || property.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#C1A06E]">
                      {property.price?.currency ?? "AED"}{" "}
                      {(property.price?.amount ?? 0).toLocaleString()}
                    </p>
                    {property.category === "for_rent" && (
                      <span className="text-sm text-gray-500">/year</span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {property.description}
                </p>

                <div className="flex items-center gap-6 text-gray-600">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                  )}
                  {property.sizeSqft && (
                    <div className="flex items-center gap-2">
                      <Maximize className="w-5 h-5" />
                      <span>{property.sizeSqft.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  {(property.whatsAppNumber || property.phone) && (
                    <Button
                      onClick={handleWhatsAppClick}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  )}
                </div>

                {property.referenceNumber && (
                  <p className="text-xs text-gray-400 mt-4">
                    Ref: {property.referenceNumber}
                  </p>
                )}
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
      <Link href={`/properties/${property._id}`}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
          <div className="relative h-72 md:h-80 overflow-hidden">
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            <Badge
              className={`absolute top-4 left-4 ${categoryColors[property.category]} text-white border-0`}
            >
              {categoryLabels[property.category]}
            </Badge>

            {property.isFeatured && (
              <Badge className="absolute top-4 right-4 bg-amber-500 text-white border-0">
                Featured
              </Badge>
            )}

            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-2xl font-bold text-white">
                {property.price?.currency ?? "AED"}{" "}
                {(property.price?.amount ?? 0).toLocaleString()}
                {property.category === "for_rent" && (
                  <span className="text-sm font-normal">/year</span>
                )}
              </p>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-lg text-primary-dark line-clamp-1 group-hover:text-[#C1A06E] transition-colors">
              {property.title}
            </h3>

            <div className="flex items-center gap-1 text-gray-500 mt-2">
              <MapPin className="w-4 h-4 text-[#C1A06E]" />
              <span className="text-sm">
                {locationLabels[property.location] || property.location}
              </span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                {property.bedrooms && (
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.sizeSqft && (
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-4 h-4" />
                    <span>{property.sizeSqft.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {(property.whatsAppNumber || property.phone) && (
                <Button
                  onClick={handleWhatsAppClick}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
              )}
            </div>

            {property.referenceNumber && (
              <p className="text-xs text-gray-400 mt-3">
                Ref: {property.referenceNumber}
              </p>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
