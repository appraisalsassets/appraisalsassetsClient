"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  
  Loader2,
 
  Grid3X3,
  List,
  
} from "lucide-react";
import api from "@/lib/api";
import { mapPropertyToDeveloperProjectShape } from "@/lib/mapDeveloperProperties";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DeveloperProjectCard from "@/components/developers/DeveloperProjectCard";

type Developer = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  about?: string;
  focus?: string;
  logo?: string;
  heroImage?: string;
  communities?: string[];
  projectsCount?: number;
};

interface Property {
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

export default function DeveloperPropertiesPage() {
  const params = useParams();
  const slug = String(params.slug || "");

  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "name" | "date"
  >("date");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch developer info
        const developerResponse = await api.getDeveloperBySlug(slug);
        if (developerResponse.success) {
          setDeveloper(developerResponse.developer || null);
        }

        const propertiesResponse = await api.getProperties({
          developerSlug: slug,
          activeOnly: "true",
          limit: "50",
        });

        if (propertiesResponse.success && propertiesResponse.properties) {
          const devName = developerResponse.developer?.name;
          setProperties(
            propertiesResponse.properties.map((p: Record<string, unknown>) =>
              mapPropertyToDeveloperProjectShape(p, slug, devName),
            ),
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price.amount - b.price.amount;
      case "price-desc":
        return b.price.amount - a.price.amount;
      case "name":
        return a.title.localeCompare(b.title);
      case "date":
      default:
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#C1A06E]" />
        <p>Loading developer properties...</p>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 p-10 text-center max-w-lg shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Developer not found
          </h1>
          <p className="text-slate-600 mb-6">
            This developer profile is unavailable or no longer active.
          </p>
          <Link href="/developers">
            <Button className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Developers
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 mt-36">
      {/* Header */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/developers/${slug}`}
                className="inline-flex items-center text-sm text-slate-500 hover:text-[#C1A06E]"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Developer Profile
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                {developer.logo ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={developer.logo}
                      alt={developer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {developer.name} Properties
                  </h1>
                  <p className="text-sm text-slate-500">
                    {properties.length} propert
                    {properties.length !== 1 ? "ies" : "y"} found
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C1A06E]"
              >
                <option value="date">Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                >
                  <Grid3X3 className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                >
                  <List className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid/List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No properties found
            </h2>
            <p className="text-slate-600 mb-6">
              {developer.name} does not have any off-plan properties available at
              the moment.
            </p>
            <Link href="/properties">
              <Button className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
                Browse All Properties
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProperties.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <DeveloperProjectCard
                      project={project}
                      index={index}
                      viewMode="grid"
                      detailHref={`/properties/${project._id}`}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedProperties.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <DeveloperProjectCard
                      project={project}
                      index={index}
                      viewMode="list"
                      detailHref={`/properties/${project._id}`}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
