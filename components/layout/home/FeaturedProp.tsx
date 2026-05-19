"use client";

import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/utils/PropertyCard";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface Property {
  _id: string;
  title: string;
  price: {
    amount: number;
    currency: string;
  };
  location: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  images: Array<{
    url: string;
    isCover: boolean;
  }>;
  isFeatured: boolean;
  isActive: boolean;
  category?: string;
  phone?: string;
  whatsAppNumber?: string;
}

export default function FeaturedProp() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await api.getProperties({
        limit: "3",
        isFeatured: "true",
        activeOnly: "true",
      });

      if (response.success && response.properties) {
        const featuredProperties = response.properties
          .filter(
            (property: Property) => property.isFeatured && property.isActive,
          )
          .slice(0, 3);

        setProperties(featuredProperties);
      }
    } catch (error) {
      console.error("Failed to fetch featured properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: { amount: number; currency: string } | null) => {
    if (!price) return "AED 0";
    return `${price.currency ?? "AED"} ${(price.amount ?? 0).toLocaleString()}`;
  };

  const formatLocation = (location: string) => {
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

    return (
      locationLabels[location] ||
      location.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const SectionHeader = () => (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
        Exclusive Listings
      </h3>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Featured Properties
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
            Discover premium residences and high-return investments curated by
            our expert Dubai Real Estate Agents, part of a leading real estate
            agency in Dubai recognized among the top real estate companies in
            Dubai.
          </p>
        </div>

        <Link href="/properties" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full border border-secondary font-medium text-secondary transition-all duration-500 ease-in-out hover:bg-secondary hover:text-white hover:shadow-none sm:w-auto"
          >
            View All Properties
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="w-full overflow-hidden bg-white py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 h-5 w-36 rounded bg-gray-200 sm:mx-0" />
            <div className="mx-auto mb-8 h-10 w-64 rounded bg-gray-200 sm:mx-0 sm:w-80" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8 xl:gap-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[420px] rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="w-full overflow-hidden bg-white py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader />

          <div className="py-12 text-center sm:py-16">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 sm:h-24 sm:w-24">
                <svg
                  className="h-10 w-10 text-gray-400 sm:h-12 sm:w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
                No Featured Properties Available
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-600 sm:text-base">
                We&apos;re currently updating our featured listings. Check back
                soon for our handpicked selection of premium properties.
              </p>

              <Link href="/properties" className="mt-6 inline-block w-full sm:w-auto">
                <Button className="w-full bg-[#C1A06E] text-white hover:bg-[#a88b5e] sm:w-auto">
                  Browse All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full overflow-hidden bg-white py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:mt-12 lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {properties.map((property) => (
            <div key={property._id} className="min-w-0">
              <PropertyCard
                id={property._id}
                image={
                  property.images.find((img) => img.isCover)?.url ||
                  property.images[0]?.url ||
                  ""
                }
                title={property.title}
                price={formatPrice(property.price)}
                location={formatLocation(property.location)}
                beds={property.bedrooms}
                baths={property.bathrooms}
                sqft={property.sizeSqft}
                featured={property.isFeatured}
                category={property.category}
                phone={property.phone}
                whatsAppNumber={property.whatsAppNumber}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
