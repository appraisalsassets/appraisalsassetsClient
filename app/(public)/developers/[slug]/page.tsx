"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  MapPin,
  Briefcase,
  Layers,
  Phone,
  Loader2,
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

export default function DeveloperProfilePage() {
  const params = useParams();
  const slug = String(params.slug || "");

  const [loading, setLoading] = useState(true);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        setLoading(true);
        const response = await api.getDeveloperBySlug(slug);
        if (response.success) {
          const dev = response.developer || null;
          setDeveloper(dev);
          // Load off-plan properties for this developer so we can show cards on profile
          if (dev?.slug) {
            const propertiesResponse = await api.getProperties({
              developerSlug: dev.slug,
              category: "off_plan",
              activeOnly: "true",
              limit: "12",
            });
            if (
              propertiesResponse.success &&
              Array.isArray(propertiesResponse.properties)
            ) {
              setProperties(
                propertiesResponse.properties.map((p: any) =>
                  mapPropertyToDeveloperProjectShape(
                    p,
                    dev.slug,
                    dev.name,
                  ),
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
      } catch (error) {
        setDeveloper(null);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchDeveloper();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#C1A06E]" />
        <p>Loading developer profile...</p>
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
              Back to Off-Plan Developers
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const propertiesUrl = `/developers/${encodeURIComponent(developer.slug)}/properties`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative flex h-[55vh] flex-col justify-end overflow-hidden lg:h-[60vh]">
        <div className="absolute inset-0">
          {developer.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={developer.heroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary-dark to-slate-800" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:gap-8"
          >
            <Link
              href="/developers"
              className="inline-flex items-center text-sm text-slate-300 hover:text-white mb-4 md:mb-0 md:order-first"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Off-Plan Developers
            </Link>
            <div className="flex items-end gap-4 md:gap-6">
              {developer.logo ? (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-white/20 shadow-xl overflow-hidden bg-white shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={developer.logo}
                    alt={developer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-10 h-10 md:w-12 md:h-12 text-[#C1A06E]" />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {developer.name}
                </h1>
                {developer.shortDescription ? (
                  <p className="text-slate-200 text-base md:text-lg max-w-2xl">
                    {developer.shortDescription}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      {developer.projectsCount !== undefined && developer.projectsCount > 0 ? (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center gap-6 text-slate-600">
              <span className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C1A06E]" />
                <span className="font-semibold text-slate-900">
                  {(developer.projectsCount || 0).toLocaleString()}
                </span>{" "}
                active project{(developer.projectsCount || 0) !== 1 ? "s" : ""}
              </span>
              {developer.communities?.length ? (
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C1A06E]" />
                  {developer.communities.length} communit
                  {developer.communities.length !== 1 ? "ies" : "y"}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* About */}
          <div className="lg:col-span-2 space-y-8">
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-[#C1A06E]" />
                About {developer.name}
              </h2>
              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4">
                {developer.about ? (
                  <div className="whitespace-pre-line text-slate-600 leading-relaxed">
                    {developer.about}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">
                    Detailed profile content will be updated soon.
                  </p>
                )}
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-24 space-y-6"
            >
              <div className="flex items-center gap-4">
                {developer.logo ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={developer.logo}
                      alt={developer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900">{developer.name}</p>
                  <p className="text-sm text-slate-500">
                    {(developer.projectsCount || 0).toLocaleString()} active
                    project{(developer.projectsCount || 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {developer.focus ? (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Focus
                  </p>
                  <p className="text-slate-700">{developer.focus}</p>
                </div>
              ) : null}

              {developer.communities?.length ? (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Communities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {developer.communities.map((community) => (
                      <span
                        key={community}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm"
                      >
                        {community}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="pt-2 space-y-3">
                <Link href={propertiesUrl} className="block">
                  <Button className="w-full bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
                    View All Properties ({developer.projectsCount || 0})
                  </Button>
                </Link>
                <Link href="/contact" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Contact Our Team
                  </Button>
                </Link>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Property cards — same listings as "View All Properties" but visible on profile */}
        {properties.length > 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-12 lg:mt-16"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Properties by {developer.name}
                </h2>
                <p className="text-slate-600 mt-1">
                  {properties.length} listing
                  {properties.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <Link href={propertiesUrl}>
                <Button
                  variant="outline"
                  className="border-[#C1A06E] text-[#C1A06E] hover:bg-[#C1A06E]/10"
                >
                  View all
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <DeveloperProjectCard
                    project={project as any}
                    index={index}
                    viewMode="grid"
                    detailHref={`/properties/${project._id}`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : developer.projectsCount && developer.projectsCount > 0 ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 rounded-2xl border border-slate-100 bg-white p-8 text-center"
          >
            <p className="text-slate-600 mb-4">
              This developer has {developer.projectsCount} project
              {developer.projectsCount !== 1 ? "s" : ""} in the system. Open
              the full list to browse.
            </p>
            <Link href={propertiesUrl}>
              <Button className="bg-[#C1A06E] hover:bg-[#a88b5e] text-white">
                View All Properties
              </Button>
            </Link>
          </motion.section>
        ) : null}
      </section>
    </div>
  );
}
