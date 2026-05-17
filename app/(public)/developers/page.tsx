"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, Search, MapPin, ArrowRight, Loader2 } from "lucide-react";
import api from "@/lib/api";
import PageHero from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type Developer = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  focus?: string;
  logo?: string;
  heroImage?: string;
  communities?: string[];
  projectsCount?: number;
  isActive?: boolean;
};

export default function DevelopersPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [developers, setDevelopers] = useState<Developer[]>([]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const response = await api.getDevelopers();
        if (response.success) {
          setDevelopers(response.developers || []);
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
    const keyword = search.trim().toLowerCase();
    if (!keyword) return developers;
    return developers.filter((developer) => {
      const inName = developer.name?.toLowerCase().includes(keyword);
      const inFocus = developer.focus?.toLowerCase().includes(keyword);
      const inDescription = developer.shortDescription
        ?.toLowerCase()
        .includes(keyword);
      const inCommunities = developer.communities?.some((c) =>
        c.toLowerCase().includes(keyword),
      );
      return Boolean(inName || inFocus || inDescription || inCommunities);
    });
  }, [developers, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHero
        title="Trusted Developers in Dubai"
        description="Explore leading off-plan developers and the communities they are building. View profiles, projects, and connect with our team for expert guidance."
        backgroundImage="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000"
        backgroundAlt="Dubai development"
        badge={
          <span className="mb-4 inline-block rounded-full border border-[#C1A06E]/40 bg-[#C1A06E]/20 px-4 py-2 text-sm font-medium text-[#C1A06E]">
            Off-Plan Developers
          </span>
        }
      />
      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Search */}
        <div className="mb-8 lg:mb-10">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, focus, or community..."
              className="pl-12 h-12 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-[#C1A06E]"
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {filteredDevelopers.length} developer
            {filteredDevelopers.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#C1A06E] mb-4" />
            <p>Loading developers...</p>
          </div>
        ) : filteredDevelopers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No developers found
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              {search.trim()
                ? "Try a different search term or browse all developers."
                : "No off-plan developers are listed yet. Contact us for information."}
            </p>
            {search.trim() ? (
              <Button
                variant="outline"
                onClick={() => setSearch("")}
                className="mr-2"
              >
                Clear search
              </Button>
            ) : null}
            <Link href="/contact">
              <Button className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
                Contact Our Team
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredDevelopers.map((developer, index) => (
              <motion.div
                key={developer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#C1A06E]/30 transition-all duration-300"
              >
                <Link href={`/developers/${developer.slug}`} className="block">
                  {/* Card image / logo area */}
                  <div className="relative h-40 bg-slate-100">
                    {developer.heroImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={developer.heroImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      {developer.logo ? (
                        <div className="w-14 h-14 rounded-xl border-2 border-white/90 shadow-lg overflow-hidden bg-white shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={developer.logo}
                            alt={developer.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-white/90 bg-white/95 flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-[#C1A06E]" />
                        </div>
                      )}
                      <span className="rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-medium text-slate-700">
                        {developer.projectsCount || 0} project
                        {(developer.projectsCount || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 lg:p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-dark">
                      {developer.name}
                    </h2>
                    {developer.shortDescription ? (
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {developer.shortDescription}
                      </p>
                    ) : (
                      <p className="text-slate-500 text-sm italic mb-4">
                        Profile details coming soon.
                      </p>
                    )}
                    {developer.focus ? (
                      <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                        <span className="font-medium text-slate-600">
                          Focus:
                        </span>{" "}
                        {developer.focus}
                      </p>
                    ) : null}
                    {developer.communities?.length ? (
                      <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-4">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                          {developer.communities.slice(0, 3).join(", ")}
                          {developer.communities.length > 3
                            ? ` +${developer.communities.length - 3}`
                            : ""}
                        </span>
                      </p>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C1A06E] group-hover:gap-2 transition-all">
                      View profile
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA strip */}
        {!loading && filteredDevelopers.length > 0 ? (
          <div className="mt-14 text-center">
            <p className="text-slate-600 mb-4">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-slate-200 hover:bg-slate-50"
              >
                Contact Our Team
              </Button>
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}
