"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

type DeveloperItem = {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
};

type OtherDevelopersSectionProps = {
  currentSlug: string;
  limit?: number;
};

export default function OtherDevelopersSection({
  currentSlug,
  limit = 6,
}: OtherDevelopersSectionProps) {
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState<DeveloperItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.getDevelopers();
        if (response.success && Array.isArray(response.developers)) {
          setDevelopers(response.developers);
        }
      } catch (error) {
        console.error("Failed to load other developers:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const others = useMemo(
    () => developers.filter((d) => d.slug !== currentSlug).slice(0, limit),
    [developers, currentSlug, limit],
  );

  if (!loading && others.length === 0) return null;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl">
            Other Developers in UAE
          </h2>
          <p className="mt-2 text-slate-600">Popular Real Estate Developers</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-[#C1A06E]" />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((developer) => (
                <Link
                  key={developer._id}
                  href={`/developers/${developer.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-[#C1A06E]/40 hover:shadow-md"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white p-2">
                    {developer.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={developer.logo}
                        alt={developer.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-slate-300" />
                    )}
                  </div>
                  <span className="font-semibold text-slate-900">
                    {developer.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/developers">
                <Button className="rounded-md bg-[#C1A06E] px-10 text-white hover:bg-[#a88b5e]">
                  View All
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
