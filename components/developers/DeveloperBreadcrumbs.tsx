import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Crumb = { label: string; href?: string };

type DeveloperBreadcrumbsProps = {
  items: Crumb[];
  className?: string;
  light?: boolean;
};

export default function DeveloperBreadcrumbs({
  items,
  className = "",
  light = false,
}: DeveloperBreadcrumbsProps) {
  const textClass = light ? "text-white/90" : "text-slate-500";
  const linkClass = light
    ? "text-white/90 hover:text-white"
    : "text-slate-500 hover:text-[#C1A06E]";
  const currentClass = light
    ? "font-medium text-white"
    : "font-medium text-primary-dark";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-1.5 text-sm ${className}`}
    >
      <Link href="/" className={`inline-flex items-center gap-1 ${linkClass}`}>
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, index) => (
        <span
          key={`${item.label}-${index}`}
          className="inline-flex items-center gap-1.5"
        >
          <ChevronRight className={`h-4 w-4 ${textClass}`} />
          {item.href ? (
            <Link href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ) : (
            <span className={currentClass}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
