"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import ServiceDetailLayout from "@/components/services/ServiceDetailLayout";
import type { Service } from "@/types/service";

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = String(params.slug || "");
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await api.getServiceBySlug(slug);
        if (response.success && response.service) {
          setService(response.service as Service);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center md:mt-24 lg:mt-32 mt-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#C1A06E]" />
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:mt-24 lg:mt-32 mt-32">
        <h1 className="text-2xl font-bold text-slate-900">Service not found</h1>
        <p className="mt-2 text-slate-600">
          This service may have been removed or is no longer available.
        </p>
      </div>
    );
  }

  return <ServiceDetailLayout service={service} />;
}
