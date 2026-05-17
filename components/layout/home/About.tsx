import Link from "next/link";
import {
  ArrowRight,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    title: "AI-backed insights",
    description:
      "Real-time market intelligence and valuation signals tailored for Dubai property portfolios.",
    Icon: Sparkles,
  },
  {
    title: "Secure collaboration",
    description:
      "Encrypted workflows for deal teams, advisors, and stakeholders with clear approvals.",
    Icon: ShieldCheck,
  },
  {
    title: "Data-first strategy",
    description:
      "Turn market signals into action with intuitive dashboards and valuation reports.",
    Icon: Layers,
  },
  {
    title: "Startup-ready support",
    description:
      "Built to scale from initial discovery to large portfolio transactions.",
    Icon: Rocket,
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const { Icon } = feature;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:border-[#C1A06E]/30 hover:shadow-md sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C1A06E]/10 text-[#a88b5e]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">
          {feature.title}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
    </article>
  );
}

export default function About() {
  return (
    <section className="bg-slate-50 py-12 text-slate-900 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + highlight card — top aligned */}
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full bg-[#C1A06E]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#a88b5e] sm:text-sm">
              Built for modern property teams
            </span>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              A smarter way to scale property decisions with startup speed.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              We combine valuation data, investor-grade analytics, and expert
              advisory in one platform for real estate teams, founders, and
              brokers — faster decisions and clearer insights on every
              transaction.
            </p>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl ring-1 ring-white/10 sm:rounded-3xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Rapid property outcomes
            </p>
            <h3 className="mt-3 text-xl font-semibold leading-snug sm:text-2xl">
              Launch deals faster with confident property intelligence.
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Pipeline clarity, valuation accuracy, and expert guidance in one
              place.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl bg-slate-900/80 p-4">
                <p className="text-2xl font-bold text-[#C1A06E] sm:text-3xl">95%</p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Faster advisory cycles
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/80 p-4">
                <p className="text-2xl font-bold text-[#C1A06E] sm:text-3xl">24/7</p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Market watch and alerts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Four feature cards — equal width & height */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
          >
            Explore our approach
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Talk with an advisor
          </Link>
        </div>
      </div>
    </section>
  );
}
