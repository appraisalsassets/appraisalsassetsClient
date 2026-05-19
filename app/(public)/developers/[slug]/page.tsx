"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { mapPropertyToDeveloperProjectShape } from "@/lib/mapDeveloperProperties";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeveloperAboutSection from "@/components/developers/DeveloperAboutSection";
import DeveloperProjectCard from "@/components/developers/DeveloperProjectCard";
import OtherDevelopersSection from "@/components/developers/OtherDevelopersSection";

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

type SortKey = "default" | "price-asc" | "price-desc" | "name";

export default function DeveloperProfilePage() {
  const params = useParams();
  const slug = String(params.slug || "");

  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [properties, setProperties] = useState<
    ReturnType<typeof mapPropertyToDeveloperProjectShape>[]
  >([]);
  const [sortBy, setSortBy] = useState<SortKey>("default");

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        setLoading(true);
        const response = await api.getDeveloperBySlug(slug);
        if (response.success) {
          const dev = response.developer || null;
          setDeveloper(dev);
          if (dev?.slug) {
            const propertiesResponse = await api.getProperties({
              developerSlug: dev.slug,
              activeOnly: "true",
              limit: "50",
            });
            if (
              propertiesResponse.success &&
              Array.isArray(propertiesResponse.properties)
            ) {
              setProperties(
                propertiesResponse.properties.map((p: Record<string, unknown>) =>
                  mapPropertyToDeveloperProjectShape(p, dev.slug, dev.name),
                ),
              );
            } else {
              setProperties([]);
            }
          } else {
            setProperties([]);
          }
        } else {
          setDeveloper(null);
          setProperties([]);
        }
      } catch {
        setDeveloper(null);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchDeveloper();
  }, [slug]);

  const sortedProperties = useMemo(() => {
    const list = [...properties];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price.amount - b.price.amount);
      case "price-desc":
        return list.sort((a, b) => b.price.amount - a.price.amount);
      case "name":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list;
    }
  }, [properties, sortBy]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-slate-500">
        <Loader2 className="h-10 w-10 animate-spin text-[#C1A06E]" />
        <p>Loading developer profile...</p>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-20">
        <div className="max-w-lg rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-400" />
          <h1 className="text-2xl font-semibold text-slate-900">
            Developer not found
          </h1>
          <p className="mt-2 text-slate-600">
            This profile is unavailable or no longer active.
          </p>
          <Link href="/developers" className="mt-6 inline-block">
            <Button className="bg-[#C1A06E] text-white hover:bg-[#a88b5e]">
              Back to Developers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const propertiesUrl = `/developers/${encodeURIComponent(developer.slug)}/properties`;
  const displayCount = properties.length || developer.projectsCount || 0;

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-slate-100 bg-white pt-28 sm:pt-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-5 text-center sm:px-6 sm:py-7 lg:px-8">
          <div className="flex h-18 w-36 items-center justify-center sm:h-24 sm:w-44">
            {developer.logo ? (
              <img
                src={developer.logo}
                alt={`${developer.name} logo`}
                className="max-h-full w-auto max-w-full object-contain"
              />
            ) : (
              <Building2 className="h-12 w-12 text-slate-400" />
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-primary-dark sm:text-3xl">
            {developer.name}
          </h1>
        </div>
      </section>

      <DeveloperAboutSection
        name={developer.name}
        about={developer.about}
        shortDescription={developer.shortDescription}
      />

      <section id="developer-projects" className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold text-primary-dark sm:text-3xl">
            Projects
          </h2>

          <div className="mt-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-700">
              <span className="font-semibold text-slate-900">
                {displayCount}
              </span>{" "}
              Propert{displayCount === 1 ? "y" : "ies"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortKey)}
              >
                <SelectTrigger className="w-[180px] border-slate-200 bg-white">
                  <SelectValue placeholder="Default Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Order</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {sortedProperties.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">
                No listings linked to this developer yet. Assign a developer in
                Admin when editing a property.
              </p>
              <Link href="/contact" className="mt-6 inline-block">
                <Button className="bg-[#C1A06E] text-white hover:bg-[#a88b5e]">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedProperties.slice(0, 12).map((project, index) => (
                  <DeveloperProjectCard
                    key={project._id}
                    project={project as any}
                    index={index}
                    viewMode="grid"
                    detailHref={`/properties/${project._id}`}
                  />
                ))}
              </div>
              {sortedProperties.length > 12 ? (
                <div className="mt-10 text-center">
                  <Link href={propertiesUrl}>
                    <Button
                      variant="outline"
                      className="border-[#C1A06E] text-[#a88b5e] hover:bg-[#C1A06E]/10"
                    >
                      View all {sortedProperties.length} properties
                    </Button>
                  </Link>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <OtherDevelopersSection currentSlug={developer.slug} />
    </div>
  );
}
