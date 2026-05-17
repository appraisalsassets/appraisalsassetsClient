"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";
import api from "@/lib/api";

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  testimonialText: string;
  rating: number;
  clientImage: string;
  propertyType: string;
  isFeatured: boolean;
  isActive: boolean;
}

const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "demo-1",
    clientName: "Sarah Johnson",
    clientRole: "Expatriate Professional",
    clientCompany: "Roberts Holdings",
    testimonialText:
      "A seamless experience buying in Downtown Dubai. Professional, transparent, and responsive throughout.",
    rating: 5,
    clientImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    propertyType: "sale",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "demo-2",
    clientName: "Raj Patel",
    clientRole: "Real Estate Investor",
    clientCompany: "Patel Holdings",
    testimonialText:
      "Excellent valuations and investment advice. One of the most reliable teams we have worked with in Dubai.",
    rating: 5,
    clientImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    propertyType: "sale",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "demo-3",
    clientName: "Ahmed Khan",
    clientRole: "Business Owner",
    clientCompany: "Patterson Developments",
    testimonialText:
      "Property management support exceeded expectations. Dependable partner for long-term investors.",
    rating: 5,
    clientImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    propertyType: "investment",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "demo-4",
    clientName: "Emma Thornton",
    clientRole: "Property Manager",
    clientCompany: "Elite Properties Dubai",
    testimonialText:
      "Strong market knowledge helped us refine leasing strategy and improve returns for our clients.",
    rating: 5,
    clientImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    propertyType: "rent",
    isFeatured: false,
    isActive: true,
  },
];

function avatarUrl(name: string, image?: string) {
  if (image?.trim()) return image;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C1A06E&color=fff&size=96`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-[#C1A06E] text-[#C1A06E]" : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Quote className="h-8 w-8 shrink-0 text-[#C1A06E]/25" aria-hidden />
        <StarRating rating={testimonial.rating} />
      </div>

      <blockquote className="line-clamp-4 flex-1 text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
        &ldquo;{testimonial.testimonialText}&rdquo;
      </blockquote>

      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl(testimonial.clientName, testimonial.clientImage)}
          alt={testimonial.clientName}
          className="h-11 w-11 shrink-0 rounded-full border-2 border-[#C1A06E]/25 object-cover"
          onError={(e) => {
            e.currentTarget.src = avatarUrl(testimonial.clientName);
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {testimonial.clientName}
          </p>
          <p className="truncate text-xs text-slate-500">
            {testimonial.clientRole}
          </p>
          {testimonial.clientCompany ? (
            <p className="truncate text-xs font-medium text-[#a88b5e]">
              {testimonial.clientCompany}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await api.getTestimonials({
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        if (response.success && response.data?.length > 0) {
          setTestimonials(response.data);
        } else {
          setTestimonials(DEMO_TESTIMONIALS);
        }
      } catch {
        setTestimonials(DEMO_TESTIMONIALS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) setCardsPerView(3);
      else if (window.innerWidth >= 640) setCardsPerView(2);
      else setCardsPerView(1);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  if (isLoading) {
    return (
      <section className="bg-slate-50 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 text-center text-slate-500 sm:px-6 lg:px-8">
          Loading testimonials...
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="overflow-hidden bg-slate-50 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a88b5e] sm:text-sm">
            Client Testimonials
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Trusted by Dubai&apos;s{" "}
            <span className="text-[#C1A06E]">Property Leaders</span>
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            What our clients say about working with Assets & Appraisals.
          </p>
        </div>

        <div className="mt-8 w-full sm:mt-10">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {maxIndex > 0 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentIndex === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:bg-white disabled:opacity-40"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "w-7 bg-[#C1A06E]"
                        : "w-2 bg-slate-300"
                    }`}
                    aria-label={`Testimonials slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
                }
                disabled={currentIndex >= maxIndex}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:bg-white disabled:opacity-40"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
