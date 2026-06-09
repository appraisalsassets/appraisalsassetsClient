import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { getServiceIcon } from "@/lib/serviceIcons";
import type { ServiceCardData } from "@/types/service";

type ServiceCardProps = {
  service: ServiceCardData & { slug: string; name: string };
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = getServiceIcon(service.icon);
  const features = (service.features || []).slice(0, 4);

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#C1A06E]/50 hover:shadow-lg sm:p-6"
    >
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C1A06E]/10 text-[#a88b5e] transition-colors group-hover:bg-[#C1A06E] group-hover:text-white">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug text-slate-900 group-hover:text-[#a88b5e] sm:text-lg">
          {service.name}
        </h3>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {service.shortDescription}
      </p>

      {features.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {features.map((feat) => (
            <li
              key={feat}
              className="flex items-start gap-2 text-xs leading-5 text-slate-600 sm:text-sm"
            >
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C1A06E]" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      )}

      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#a88b5e]">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
