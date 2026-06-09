"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServiceIcon } from "@/lib/serviceIcons";
import api from "@/lib/api";
import type { Service } from "@/types/service";

type ServiceDetailLayoutProps = {
  service: Service;
};

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a88b5e] sm:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default function ServiceDetailLayout({
  service,
}: ServiceDetailLayoutProps) {
  const Icon = getServiceIcon(service.icon);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const phone = service.consultationPhone || "+971 56 137 1450";
  const email = service.consultationEmail || "info@assetsappraisals.com";

  const handleConsultation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.createInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        inquiry_type: "service",
        message: `Consultation request for service: ${service.name}`,
      });

      if (response.success) {
        toast.success("Consultation request sent successfully");
        setForm({ name: "", email: "", phone: "" });
      } else {
        toast.error(response.message || "Failed to send request");
      }
    } catch {
      toast.error("Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-slate-100 bg-slate-50 pt-4 sm:pt-6 md:mt-28 lg:mt-36 mt-36">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-2 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#a88b5e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#C1A06E]/20 bg-[#C1A06E]/10 px-4 py-2 text-sm font-medium text-[#a88b5e]">
                <Icon className="h-4 w-4" />
                {service.name}
              </div>
              <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {service.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {service.shortDescription}
              </p>
              {service.overview ? (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  {service.overview}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                {service.ctaButtonText || "Book a Free Consultation"}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                No obligation. We will review your requirements and guide you
                on the right approach.
              </p>
              <form onSubmit={handleConsultation} className="mt-5 space-y-3">
                <Input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <Input
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#C1A06E] hover:bg-[#a88b5e]"
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Submit Request
                </Button>
              </form>
            </div>
          </div>

          {service.heroImage ? (
            <div className="relative mt-10 h-56 overflow-hidden rounded-2xl sm:h-72">
              <Image
                src={service.heroImage}
                alt={service.name}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
          ) : null}
        </div>
      </section>

      {service.whyChooseItems && service.whyChooseItems.length > 0 ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why choose us"
              title={service.whyChooseTitle || "Why Choose Us"}
              subtitle={service.whyChooseSubtitle}
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {service.whyChooseItems.map((item) => (
                <article
                  key={`${item.title}-${item.description}`}
                  className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.offerings && service.offerings.length > 0 ? (
        <section className="bg-slate-50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Our services"
              title={service.offeringsTitle || "What We Offer"}
              subtitle={service.offeringsSubtitle}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {service.offerings.map((item) => (
                <article
                  key={`${item.title}-${item.description}`}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.steps && service.steps.length > 0 ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Step by step"
              title={service.stepsTitle || "How We Handle It"}
              subtitle={service.stepsSubtitle}
            />
            <div className="mt-10 space-y-4">
              {service.steps.map((item, index) => (
                <div
                  key={`${item.step}-${item.title}`}
                  className="flex gap-4 rounded-xl border border-slate-100 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C1A06E]/10 text-sm font-bold text-[#a88b5e]">
                    {item.step || String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.coverageAreas && service.coverageAreas.length > 0 ? (
        <section className="bg-slate-50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Coverage"
              title={service.coverageTitle || "Areas We Serve"}
              subtitle={service.coverageSubtitle}
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {service.coverageAreas.map((area) => (
                <article
                  key={`${area.region}-${area.locations}`}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-slate-900">{area.region}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {area.locations}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.pricingRows && service.pricingRows.length > 0 ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Pricing"
              title={service.pricingTitle || "Cost & Timeline"}
              subtitle={service.pricingSubtitle}
            />
            <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      Timeline
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {service.pricingRows.map((row) => (
                    <tr key={`${row.label}-${row.validity}`}>
                      <td className="px-4 py-3 text-slate-900">{row.label}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.validity}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {service.faqs && service.faqs.length > 0 ? (
        <section className="bg-slate-50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="FAQ"
              title={service.faqTitle || "Common Questions"}
              subtitle={service.faqSubtitle}
            />
            <div className="mt-10 space-y-3">
              {service.faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={`${faq.question}-${index}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-medium text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen ? (
                      <div className="border-t border-slate-100 px-5 py-4 text-sm leading-6 text-slate-600">
                        {faq.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-slate-100 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-2xl bg-secondary p-8 text-white lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C1A06E]">
                Personal consultation
              </p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                {service.ctaTitle || "Get Started With Us Today"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {service.ctaDescription ||
                  "Share your goals and timeline. Our team will map the best path for your property needs."}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#C1A06E]" />
                  Tailored guidance for buyers, sellers, and investors
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#C1A06E]" />
                  Clear next steps within 24 hours
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-medium text-slate-200">Quick contact</p>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="mt-4 flex items-center gap-3 text-white transition-colors hover:text-[#C1A06E]"
              >
                <Phone className="h-5 w-5" />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="mt-3 flex items-center gap-3 text-white transition-colors hover:text-[#C1A06E]"
              >
                <Mail className="h-5 w-5" />
                {email}
              </a>
              <Button
                asChild
                className="mt-6 w-full bg-[#C1A06E] hover:bg-[#a88b5e]"
              >
                <Link href="/contact">{service.ctaButtonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
