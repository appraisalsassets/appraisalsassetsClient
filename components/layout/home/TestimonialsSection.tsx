"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
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
  createdAt?: string;
  updatedAt?: string;
}

// Fallback demo data when API is unavailable
const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "demo-1",
    clientName: "Sarah Johnson",
    clientRole: "Expatriate Professional",
    clientCompany: "Roberts Holdings",
    testimonialText: "Working with this real estate agency in Dubai was a seamless experience. The Dubai Real Estate Agents guided me through every step of buying my first home in Downtown Dubai. Truly the Best Real Estate Agency in Dubai for professionalism and transparency..",
    rating: 5,
    clientImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    propertyType: "sale",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "demo-2",
    clientName: "Raj Patel",
    clientRole: " Real Estate Investor – Patel Holdings",
    clientCompany: "Private Client",
    testimonialText: "As a property investor, I needed expert advice and accurate valuations. Their real estate broker Dubai team provided detailed insights and strategic investment support. Without a doubt, one of the top real estate companies in Dubai offering reliable real estate services in Dubai.",
    rating: 5,
    clientImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    propertyType: "sale",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "demo-3",
    clientName: "Ahmed Khan",
    clientRole: "Business Owner",
    clientCompany: "Patterson Developments",
    testimonialText: "I entrusted their property management agency with my commercial assets, and their real estate management Dubai solutions exceeded expectations. Among the most dependable real estate management companies in Dubai and a highly recommended real estate company for long-term investors.",
    rating: 5,
    clientImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    propertyType: "investment",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "demo-4",
    clientName: "Emma Thornton",
    clientRole: "Property Manager",
    clientCompany: "Elite Properties Dubai",
    testimonialText: "Outstanding service for our portfolio valuations. The team's deep understanding of Dubai's residential and commercial markets helped us optimize our leasing strategies and maximize returns for our clients.",
    rating: 5,
    clientImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    propertyType: "rent",
    isFeatured: false,
    isActive: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-[#C1A06E]" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, isActive }: { testimonial: Testimonial; isActive: boolean }) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all duration-500 ease-out ${
        isActive
          ? "opacity-100 scale-100"
          : "opacity-50 scale-95 pointer-events-none"
      }`}
    >
      {/* Quotation icon */}
      <div className="absolute top-6 right-8 text-[#C1A06E]/10">
        <Quote className="w-12 h-12" />
      </div>

      {/* Star rating */}
      <div className="flex mb-6">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Review text */}
      <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 relative">
        {testimonial.testimonialText}
      </blockquote>

      {/* Customer info */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#C1A06E]/30 flex-shrink-0">
          {testimonial.clientImage && testimonial.clientImage.trim() !== "" ? (
            <Image
              src={testimonial.clientImage}
              alt={testimonial.clientName}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=C1A06E&color=fff&size=56`;
              }}
            />
          ) : (
            <Image
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=C1A06E&color=fff&size=56`}
              alt={testimonial.clientName}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 text-lg truncate">
            {testimonial.clientName}
          </h4>
          <p className="text-gray-500 text-sm truncate">{testimonial.clientRole}</p>
          {testimonial.clientCompany && (
            <p className="text-[#C1A06E] text-sm font-medium truncate">
              {testimonial.clientCompany}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await api.getTestimonials({
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        if (response.success && response.data && response.data.length > 0) {
          setTestimonials(response.data);
        } else {
          // Fallback to demo data when API returns empty
          console.warn("No testimonials from API, using demo data");
          setTestimonials(DEMO_TESTIMONIALS);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Fallback to demo data on any error
        console.warn("API error, using demo data instead");
        setTestimonials(DEMO_TESTIMONIALS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-primary-dark">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p>No testimonials available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#C1A06E]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-primary uppercase tracking-wide text-sm font-medium mb-4">
            Client Testimonials
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Trusted by Dubai&apos;s <span className="text-[#C1A06E]">Property Leaders</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            What our valued clients say about their experience with our real estate agency in Dubai
          </p>
        </motion.div>

        {/* Testimonial card with navigation */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className={index === currentIndex ? "block" : "hidden"}>
                <TestimonialCard testimonial={testimonial} isActive={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              prevSlide();
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#C1A06E] hover:border-[#C1A06E] hover:shadow-lg transition-all duration-300 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Dots indicator */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  goToSlide(index);
                }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#C1A06E] w-7"
                    : "bg-gray-300 hover:bg-[#C1A06E]/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setIsAutoPlaying(false);
              nextSlide();
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#C1A06E] hover:border-[#C1A06E] hover:shadow-lg transition-all duration-300 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Progress bar indicator */}
        <div className="max-w-4xl mx-auto mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C1A06E] transition-all duration-[5000ms] ease-linear"
            style={{ width: `${isAutoPlaying ? 100 : 0}%` }}
          />
        </div>

        {/* All testimonials preview grid */}
        <div className="mt-16 flex justify-between gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex-1 ${
                index === currentIndex
                  ? "border-[#C1A06E] bg-white shadow-md"
                  : "border-gray-100 bg-white/50 hover:border-[#C1A06E]/50 hover:bg-white"
              }`}
            >
              <div className="flex gap-3 items-start">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {testimonial.clientImage && testimonial.clientImage.trim() !== "" ? (
                    <Image
                      src={testimonial.clientImage}
                      alt={testimonial.clientName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=C1A06E&color=fff&size=40`}
                      alt={testimonial.clientName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {testimonial.clientName}
                  </h4>
                  <p className="text-gray-500 text-xs truncate">{testimonial.clientRole}</p>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 ${i < testimonial.rating ? "text-[#C1A06E]" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

