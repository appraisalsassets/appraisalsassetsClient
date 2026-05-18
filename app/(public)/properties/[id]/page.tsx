"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Building2,
  Share2,
  ArrowLeft,
  Check,
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatAed } from "@/lib/utils";

import ImageGallery from "@/components/properties/ImageGallery";
import MortgageCalculator from "@/components/properties/MortgageCalculator";
import InquiryForm from "@/components/properties/InquiryForm";

interface Property {
  _id: string;
  title: string;
  category: string;
  status?: string;
  location: string;
  price?: {
    currency: string;
    amount: number;
  };
  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: number;
  propertyType: string;
  description?: string;
  amenities?: string[];
  referenceNumber?: string;
  phone?: string;
  whatsAppNumber?: string;
  images?: string[] | { url: string }[];
  documentPdf?: {
    url?: string;
    fileName?: string;
  };
}

const locationLabels: Record<string, string> = {
  dubai_marina: "Dubai Marina",
  downtown_dubai: "Downtown Dubai",
  bussiness_bay: "Business Bay",
  jvc: "Jumeirah Village Circle",
  palm_jumeirah: "Palm Jumeirah",
  dubai_hills: "Dubai Hills Estate",
  arabian_ranches: "Arabian Ranches",
  emaar_beachfront: "Emaar Beachfront",
  blue_waters: "Bluewaters Island",
  city_walks: "City Walk",
};

const categoryLabels: Record<string, string> = {
  for_sale: "For Sale",
  for_rent: "For Rent",
  off_plan: "Off-Plan",
  commercial: "Commercial",
};

const propertyTypeLabels: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  townhouse: "Townhouse",
  penthouse: "Penthouse",
  office: "Office",
  retail: "Retail",
  warehouse: "Warehouse",
};

export default function PropertyDetail() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperty = useCallback(async () => {
    try {
      console.log("Fetching property with ID:", params.id);
      const response = await api.getProperty(params.id as string);
      console.log("Property API Response:", response);

      // Handle different possible response structures
      if (response.success) {
        if (response.data) {
          console.log("Found property in response.data:", response.data);
          setProperty(response.data as Property);
        } else if (response.property) {
          console.log(
            "Found property in response.property:",
            response.property,
          );
          setProperty(response.property as Property);
        } else if (response.properties && Array.isArray(response.properties)) {
          // If it returns an array, find the specific property
          const foundProperty = response.properties.find(
            (p: Property) => p._id === params.id,
          );
          if (foundProperty) {
            console.log("Found property in properties array:", foundProperty);
            setProperty(foundProperty as Property);
          } else {
            console.log("Property not found in array");
            toast.error("Property not found");
          }
        } else {
          console.log("Unknown response structure:", response);
          toast.error("Property not found");
        }
      } else {
        console.log("API request failed:", response);
        toast.error(response.message || "Property not found");
      }
    } catch (error) {
      console.error("Failed to fetch property:", error);
      toast.error("Failed to load property details");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C1A06E]" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Property not found
          </h2>
          <Link href="/properties">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const normalizedCategory = (property.category || "").toLowerCase();
  const isSaleProperty =
    normalizedCategory === "for_sale" || normalizedCategory === "sale";
  const hasValidPrice = Number(property.price?.amount || 0) > 0;
  const pdfUrl = property.documentPdf?.url?.trim() || "";
  const pdfFileName =
    property.documentPdf?.fileName?.trim() || "property-brochure.pdf";

  return (
    <div className="min-h-screen bg-gray-50 mt-36">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <Link
            href="/properties"
            className="inline-flex items-center text-gray-600 hover:text-[#C1A06E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={property.images} />

            {/* Property Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-[#C1A06E] text-white border-0">
                      {categoryLabels[property.category]}
                    </Badge>
                    {property.status === "sold" && (
                      <Badge variant="destructive">Sold</Badge>
                    )}
                    {property.status === "rented" && (
                      <Badge variant="secondary">Rented</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-primary-dark">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="w-5 h-5 text-[#C1A06E]" />
                    <span>
                      {locationLabels[property.location] || property.location}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-[#C1A06E]">
                    {formatAed(property.price?.amount ?? 0)}
                  </p>
                  {property.category === "for_rent" && (
                    <span className="text-gray-500">/year</span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-gray-100">
                {property.bedrooms !== undefined && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Bed className="w-6 h-6 text-[#C1A06E]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-semibold text-primary-dark">
                        {property.bedrooms}
                      </p>
                    </div>
                  </div>
                )}
                {property.bathrooms !== undefined && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Bath className="w-6 h-6 text-[#C1A06E]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-semibold text-primary-dark">
                        {property.bathrooms}
                      </p>
                    </div>
                  </div>
                )}
                {property.sizeSqft && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Maximize className="w-6 h-6 text-[#C1A06E]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-semibold text-primary-dark">
                        {property.sizeSqft?.toLocaleString()} sqft
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#C1A06E]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold text-primary-dark">
                      {propertyTypeLabels[property.propertyType] ||
                        property.propertyType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {pdfUrl ? (
                  <Button
                    asChild
                    className="w-full sm:flex-1 bg-[#C1A06E] hover:bg-[#a88b5e] text-white"
                  >
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={pdfFileName}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download brochure (PDF)
                    </a>
                  </Button>
                ) : null}
                <Button variant="outline" className="w-full sm:flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>

            {/* Description */}
            {property.description && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-primary-dark mb-4">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-primary-dark mb-4">
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map(
                      (amenity: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-[#C1A06E]" />
                          <span className="text-gray-600 capitalize">
                            {amenity.replace(/_/g, " ")}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mortgage Calculator */}
            <MortgageCalculator propertyPrice={property.price?.amount ?? 0} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reference Number */}
            {property.referenceNumber && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-500">Property Reference</p>
                  <p className="font-semibold text-primary-dark">
                    {property.referenceNumber}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary-dark mb-4">
                  Contact Agent
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() =>
                      window.open(`tel:${property.phone}`, "_blank")
                    }
                    className="w-full bg-[#C1A06E] hover:bg-[#A68B5B] text-white"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Call Agent
                  </Button>
                  {property.whatsAppNumber && (
                    <Button
                      onClick={() =>
                        window.open(
                          `https://wa.me/${property.whatsAppNumber?.replace(/[^0-9]/g, "")}`,
                          "_blank",
                        )
                      }
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Inquiry Form */}
            <InquiryForm property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}
