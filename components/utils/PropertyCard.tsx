import {
  BedDouble,
  Bath,
  Square,
  MapPin,
  MessageCircle,
  Mail,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { PropertyCardProps } from "@/types/property";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const locationLabels = {
  "dubai-marina": "Dubai Marina",
  "downtown-dubai": "Downtown Dubai",
  "business-bay": "Business Bay",
  jvc: "JVC",
  "palm-jumeirah": "Palm Jumeirah",
  "dubai-hills": "Dubai Hills",
  "arabian-ranches": "Arabian Ranches",
  "emaar-beachfront": "Emaar Beachfront",
  bluewaters: "Bluewaters",
  "city-walk": "City Walk",
};

const categoryLabels = {
  sale: "For Sale",
  rent: "For Rent",
  "off-plan": "Off-Plan",
  commercial: "Commercial",
};

const categoryColors = {
  sale: "bg-emerald-500",
  rent: "bg-blue-500",
  "off-plan": "bg-[#C5A572]",
  commercial: "bg-purple-500",
};

export default function PropertyCard({
  id,
  image,
  title,
  price,
  location,
  beds,
  baths,
  sqft,
  featured,
  category,
  propertyType,
  amenities,
  description,
  referenceNumber,
  phone,
  whatsAppNumber,
  email,
  status,
  wrapInLink = true,
}: PropertyCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(image?.trim() || "");

  useEffect(() => {
    setImgSrc(image?.trim() || "");
    setImgError(false);
  }, [image]);

  const showImagePlaceholder = !imgSrc || imgError;
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const phoneNumber = whatsAppNumber || phone || "+971501234567"; // Default number for testing
    if (!phoneNumber) {
      console.warn("No phone number available for WhatsApp contact");
      return;
    }

    const message = encodeURIComponent(
      `Hi! I'm interested in this property:\n\n🏠 *${title}*\n💰 Price: ${price}\n📍 Location: ${locationLabels[location as keyof typeof locationLabels] || location}${beds ? `\n🛏️ Beds: ${beds}` : ""}${baths ? `\n🚿 Baths: ${baths}` : ""}${sqft ? `\n📐 Size: ${sqft.toLocaleString()} sqft` : ""}${referenceNumber ? `\n📋 Reference: ${referenceNumber}` : ""}\n\nI would like to know more details about this property.`,
    );

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const emailAddress = email || "info@example.com";
    const subject = encodeURIComponent(`Inquiry about ${title}`);
    const body = encodeURIComponent(
      `Hi! I'm interested in this property:\n\nProperty Title: ${title}\nPrice: ${price}\nLocation: ${locationLabels[location as keyof typeof locationLabels] || location}${beds ? `\nBedrooms: ${beds}` : ""}${baths ? `\nBathrooms: ${baths}` : ""}${sqft ? `\nSize: ${sqft.toLocaleString()} sqft` : ""}${referenceNumber ? `\nReference: ${referenceNumber}` : ""}\n\nI would like to know more details about this property.\n\nPlease contact me with more information.`,
    );

    const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, "_blank");
  };

  const cardContent = (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      {/* Property Image */}
      <div className="relative h-72 md:h-80 overflow-hidden">
        {showImagePlaceholder ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-200">
            <Building2 className="w-16 h-16 text-slate-400" aria-hidden />
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={title || "Property"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {category && (
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium border-0 ${
              categoryColors[category as keyof typeof categoryColors] ||
              "bg-gray-500"
            }`}
          >
            {categoryLabels[category as keyof typeof categoryLabels] ||
              category}
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-2xl font-bold text-white">
            {price}
            {category === "rent" && (
              <span className="text-sm font-normal">/year</span>
            )}
          </p>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-primary-dark line-clamp-1 group-hover:text-[#C5A572] transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <MapPin className="w-4 h-4 text-[#C5A572]" />
          <span className="text-sm">
            {locationLabels[location as keyof typeof locationLabels] ||
              location}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            {beds && (
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" />
                <span>{beds}</span>
              </div>
            )}
            {baths && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4" />
                <span>{baths}</span>
              </div>
            )}
            {sqft && (
              <div className="flex items-center gap-1.5">
                <Square className="w-4 h-4" />
                <span>{sqft.toLocaleString()}</span>
              </div>
            )}
          </div>

          {(whatsAppNumber || phone || true) && (
            <Button
              onClick={handleWhatsAppClick}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          )}
          {email && (
            <Button
              onClick={handleEmailClick}
              size="sm"
              variant="outline"
              className="border-slate-200 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </Button>
          )}
        </div>

        {referenceNumber && (
          <p className="text-xs text-gray-400 mt-3">Ref: {referenceNumber}</p>
        )}
      </div>
    </div>
  );

  if (wrapInLink) {
    return <Link href={`/properties/${id}`}>{cardContent}</Link>;
  }

  return cardContent;
}
