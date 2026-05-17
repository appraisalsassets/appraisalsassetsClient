"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Loader2, Search } from "lucide-react";
import api from "@/lib/api";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeveloperBreadcrumbs from "@/components/developers/DeveloperBreadcrumbs";
import DeveloperLogoCard from "@/components/developers/DeveloperLogoCard";

type Developer = {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  displayOrder?: number;
  projectsCount?: number;
};

export default function DevelopersPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [developers, setDevelopers] = useState<Developer[]>([]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const response = await api.getDevelopers();
        if (response.success) {
          const list = (response.developers || []) as Developer[];
          list.sort(
            (a, b) =>
              (a.displayOrder ?? 0) - (b.displayOrder ?? 0) ||
              a.name.localeCompare(b.name),
          );
          setDevelopers(list);
        }
      } catch (error) {
        console.error("Failed to fetch developers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const filteredDevelopers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return developers;
    return developers.filter((developer) =>
      developer.name?.toLowerCase().includes(keyword),
    );
  }, [developers, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Discover Leading Property Developers Across the UAE"
        description="Browse trusted off-plan developers, explore their portfolios, and connect with our team for expert guidance on Dubai investments."
        backgroundImage="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000"
        backgroundAlt="Dubai skyline"
        badge={
          <span className="mb-4 inline-block rounded-full border border-[#C1A06E]/40 bg-[#C1A06E]/20 px-4 py-2 text-sm font-medium text-[#C1A06E]">
            Off-Plan Developers
          </span>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <DeveloperBreadcrumbs
          items={[{ label: "Off Plan Developers" }]}
          className="mb-8"
        />

        <form
          onSubmit={handleSearch}
          className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter Developer Name"
              className="h-12 rounded-lg border-slate-200 pl-12 text-base shadow-sm focus-visible:ring-[#C1A06E]"
            />
          </div>
          <Button
            type="submit"
            className="h-12 shrink-0 rounded-lg bg-[#C1A06E] px-8 text-base font-semibold text-white hover:bg-[#a88b5e]"
          >
            Search Developers
          </Button>
        </form>

        <p className="mb-8 text-sm text-slate-600">
          {loading
            ? "Loading developers…"
            : `${filteredDevelopers.length} developer${filteredDevelopers.length !== 1 ? "s" : ""} found`}
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#C1A06E]" />
            <p>Loading developers...</p>
          </div>
        ) : filteredDevelopers.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              No developers found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-slate-600">
              {query.trim()
                ? "Try another name or clear your search."
                : "Developers will appear here once added in the admin panel with logos."}
            </p>
            {query.trim() ? (
              <Button
                type="button"
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearch("");
                  setQuery("");
                }}
              >
                Clear search
              </Button>
            ) : (
              <Link href="/contact" className="mt-6 inline-block">
                <Button className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
                  Contact Our Team
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDevelopers.map((developer, index) => (
              <DeveloperLogoCard
                key={developer._id}
                developer={developer}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
