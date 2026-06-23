"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, LayoutGrid, List, Loader2 } from "lucide-react";
import PropertyFilters from "./PropertyFilters";
import PageHero from "@/components/layout/PageHero";
import PropertyCard from "../utils/PropertyCard";
import SaveSearchDialog from "./SaveSearchDialog";
import { Property, getPropertyImage, normalizeProperty } from "@/types/property";
import { categoryMatches } from "@/lib/propertyCategory";
import { toast } from "sonner";
import { LOCATION_LABELS } from "@/constants/locations";

interface PropertiesPageProps {
  initialCategory?: string;
  pageTitle?: string;
  pageDescription?: string;
  lockCategory?: boolean;
}

const insightCards = [
  {
    title: "How to evaluate ROI before buying",
    description:
      "Understand rental yield, service charges, and location fundamentals before finalizing a property decision.",
    href: "/blog",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Ready vs commercial properties in Dubai",
    description:
      "Compare rental demand, operating costs, and long-term growth potential across key segments.",
    href: "/blog",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Neighborhood selection checklist",
    description:
      "Shortlist communities based on commute, schools, amenities, and expected appreciation profile.",
    href: "/blog",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
];

const buyerChecklist = [
  "Confirm total budget including DLD fees, agency fees, and service charges.",
  "Compare expected rental yield with recent transaction and occupancy trends.",
  "Review developer/re-seller track record and maintenance quality.",
  "Assess location fundamentals: transport, schools, retail, and infrastructure.",
];

const faqItems = [
  {
    question: "Should I choose ready or commercial property?",
    answer:
      "Ready properties can provide immediate use or rental income, while commercial units may offer different yield and lease structures. The best choice depends on your timeline, strategy, and risk profile.",
  },
  {
    question: "What are the main upfront buying costs in Dubai?",
    answer:
      "Typical upfront costs include DLD transfer fee, registration/admin charges, and agency fees. Mortgage buyers may also have valuation and processing charges.",
  },
  {
    question: "How do I shortlist the right community?",
    answer:
      "Start with commute and lifestyle needs, then compare price per sqft, rental demand, planned infrastructure, and long-term neighborhood development.",
  },
];

export default function PropertiesPage({
  initialCategory = "",
  pageTitle = "Find Your Perfect Property",
  pageDescription = "Explore our extensive collection of premium properties across Dubai's most prestigious locations",
  lockCategory = false,
}: PropertiesPageProps) {
  const searchParams = useSearchParams();

  const developerSlugFromUrl = searchParams.get("developerSlug") || "";

  const [filters, setFilters] = useState({
    category: initialCategory || searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    property_type: searchParams.get("property_type") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    search: searchParams.get("search") || "",
  });

  const [sortBy, setSortBy] = useState("-createdAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isCategoryLocked = lockCategory && Boolean(initialCategory);

  useEffect(() => {
    fetchProperties();
  }, [initialCategory, isCategoryLocked, developerSlugFromUrl]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const categoryParam =
        isCategoryLocked && initialCategory
          ? initialCategory
          : searchParams.get("category") || "";
      const requestParams: Record<string, string> = {
        activeOnly: "true",
        limit: "500",
      };
      if (categoryParam) requestParams.category = categoryParam;
      if (developerSlugFromUrl)
        requestParams.developerSlug = developerSlugFromUrl;
      const response = await api.getProperties(requestParams);
      if (response.success && Array.isArray(response.properties)) {
        setProperties(
          response.properties
            .map((p: Property) => normalizeProperty(p as unknown as Record<string, unknown>))
            .filter((p) => p.isActive !== false),
        );
      } else {
        setProperties([]);
        toast.error(response.message || "Could not load properties");
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
      toast.error(
        error instanceof Error
          ? error.message
          : "Cannot reach the API. Start the server (npm run dev in /server) and check NEXT_PUBLIC_API_URL in .env.local",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Apply filters
    if (filters.category) {
      result = result.filter((p) =>
        categoryMatches(p.category || "", filters.category),
      );
    }
    if (filters.location) {
      const loc = filters.location;
      const label = LOCATION_LABELS[loc];
      const lowered = loc.toLowerCase();
      result = result.filter((p) => {
        const pLoc = (p.location || "").toString();
        return (
          pLoc === loc ||
          pLoc === label ||
          pLoc.toLowerCase() === lowered
        );
      });
    }
    if (filters.property_type) {
      result = result.filter((p) => p.propertyType === filters.property_type);
    }
    if (filters.bedrooms) {
      if (filters.bedrooms === "studio") {
        result = result.filter((p) => p.bedrooms === 0);
      } else if (filters.bedrooms === "5+") {
        result = result.filter((p) => (p.bedrooms || 0) >= 5);
      } else {
        result = result.filter(
          (p) => p.bedrooms === parseInt(filters.bedrooms || "0"),
        );
      }
    }
    if (filters.bathrooms) {
      if (filters.bathrooms === "5+") {
        result = result.filter((p) => (p.bathrooms || 0) >= 5);
      } else {
        result = result.filter(
          (p) => p.bathrooms === parseInt(filters.bathrooms || "0"),
        );
      }
    }
    if (filters.minPrice) {
      result = result.filter(
        (p) => (p.price?.amount || 0) >= parseInt(filters.minPrice),
      );
    }
    if (filters.maxPrice) {
      result = result.filter(
        (p) => (p.price?.amount || 0) <= parseInt(filters.maxPrice),
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.referenceNumber?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    if (sortBy === "-createdAt") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    } else if (sortBy === "price") {
      result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    }

    return result;
  }, [properties, filters, sortBy]);

  const handleSearch = () => {
    // The filters are already applied through the useMemo
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero title={pageTitle} description={pageDescription} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <PropertyFilters
          filters={filters}
          onChange={(nextFilters) => {
            if (isCategoryLocked && initialCategory) {
              setFilters({ ...nextFilters, category: initialCategory });
              return;
            }
            setFilters(nextFilters);
          }}
          onSearch={handleSearch}
          hideCategoryFilter={isCategoryLocked}
        />

        <div className="flex justify-end mb-4">
          <SaveSearchDialog filters={filters} />
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-primary-dark">
              {filteredProperties.length}
            </span>{" "}
            properties found
          </p>

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">Newest First</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 ${viewMode === "grid" ? "bg-primary-dark text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 ${viewMode === "list" ? "bg-primary-dark text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#C1A06E]" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary-dark mb-2">
              No properties found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters to see more results
            </p>
            <Button
              onClick={() =>
                setFilters({
                  category: "",
                  location: "",
                  property_type: "",
                  bedrooms: "",
                  bathrooms: "",
                  minPrice: "",
                  maxPrice: "",
                  search: "",
                })
              }
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                id={property._id}
                image={getPropertyImage(property)}
                title={property.title}
                price={`${property.price?.currency} ${property.price?.amount?.toLocaleString()}`}
                location={property.location}
                beds={property.bedrooms}
                baths={property.bathrooms}
                sqft={property.sizeSqft}
                featured={property.isFeatured}
                category={property.category}
                propertyType={property.propertyType}
                amenities={property.amenities}
                description={property.description}
                referenceNumber={property.referenceNumber}
                phone={property.phone}
                whatsAppNumber={property.whatsAppNumber}
                status={property.status}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                id={property._id}
                image={getPropertyImage(property)}
                title={property.title}
                price={`${property.price?.currency} ${property.price?.amount?.toLocaleString()}`}
                location={property.location}
                beds={property.bedrooms}
                baths={property.bathrooms}
                sqft={property.sizeSqft}
                featured={property.isFeatured}
                category={property.category}
                propertyType={property.propertyType}
                amenities={property.amenities}
                description={property.description}
                referenceNumber={property.referenceNumber}
                phone={property.phone}
                whatsAppNumber={property.whatsAppNumber}
                status={property.status}
                wrapInLink={false}
              />
            ))}
          </div>
        )}

        {/* Post-listing content */}
        <section className="mt-14 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Live Listings</p>
              <p className="text-2xl font-bold text-primary-dark mt-1">
                {filteredProperties.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Primary Market Segments</p>
              <p className="text-2xl font-bold text-primary-dark mt-1">4</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Advisory Support</p>
              <p className="text-2xl font-bold text-primary-dark mt-1">
                End-to-End
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary-dark mb-3">
              Property Buying Guidance
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Dubai real estate offers diverse opportunities across ready and
              commercial inventory. After reviewing listings, compare ownership
              costs, expected rental demand, and long-term infrastructure plans
              in your target area. A structured approach helps you choose assets
              that align with your budget, timeline, and investment goals.
            </p>
            <div className="mt-5 relative h-72 md:h-80 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
                alt="Dubai property skyline"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-semibold text-primary-dark mb-4">
              Buyer Checklist Before You Commit
            </h3>
            <ul className="space-y-3">
              {buyerChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#C1A06E] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl md:text-2xl font-semibold text-primary-dark">
                Market Insights
              </h3>
              <Link
                href="/blog"
                className="text-sm text-[#C1A06E] hover:underline"
              >
                View all articles
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insightCards.map((card) => (
                <article
                  key={card.title}
                  className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={800}
                    height={440}
                    className="h-52 md:h-56 w-full object-cover"
                  />
                  <div className="p-5">
                    <h4 className="font-semibold text-primary-dark mb-2">
                      {card.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {card.description}
                    </p>
                    <Link
                      href={card.href}
                      className="inline-flex items-center text-sm font-medium text-[#C1A06E] hover:underline"
                    >
                      Read more
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-semibold text-primary-dark mb-4">
              Frequently Asked Questions
            </h3>
            <div className="relative h-64 md:h-72 rounded-xl overflow-hidden mb-5">
              <Image
                src="https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80"
                alt="Real estate consultation"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              {faqItems.map((faq) => (
                <div
                  key={faq.question}
                  className="border-b border-slate-100 pb-4 last:border-b-0"
                >
                  <h4 className="font-semibold text-primary-dark mb-1">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold mb-1">
                Need help shortlisting properties?
              </h3>
              <p className="text-gray-300">
                Connect with our advisors for a curated list based on your
                budget and goals.
              </p>
            </div>
            <Link href="/contact">
              <Button className="bg-[#C1A06E] hover:bg-[#A68B5B] text-white">
                Speak to an Advisor
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
