"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  FALLBACK_PROPERTY_OPTIONS,
  normalizeSelectOptions,
  SelectOption,
} from "@/constants/form-options";

export default function HomeHeroInquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry_type: "general",
    message: "I would like to speak with an advisor about Dubai property opportunities.",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryTypes, setInquiryTypes] = useState<SelectOption[]>(
    FALLBACK_PROPERTY_OPTIONS.inquiryTypes,
  );

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await api.getPropertyFormOptions();
        if (response.success && response.data) {
          setInquiryTypes(
            normalizeSelectOptions(
              response.data.inquiryTypes,
              FALLBACK_PROPERTY_OPTIONS.inquiryTypes,
            ),
          );
        }
      } catch {
        // Keep fallback types
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.createInquiry({
        ...formData,
        property_title: "Homepage inquiry",
      });

      if (response.success) {
        setIsSubmitted(true);
        toast.success("Inquiry submitted successfully!");
      } else {
        toast.error(
          response.message || "Failed to submit inquiry. Please try again.",
        );
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit inquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      inquiry_type: "general",
      message:
        "I would like to speak with an advisor about Dubai property opportunities.",
    });
  };

  const fieldClass =
    "h-11 border-white/20 bg-white/10 text-white placeholder:text-slate-400 focus-visible:border-[#C1A06E] focus-visible:ring-[#C1A06E]/30";

  return (
    <div
      id="hero-inquiry-form"
      className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-6 lg:p-7"
    >
      {isSubmitted ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-7 w-7 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Thank you!</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Your inquiry was received. Our team will contact you shortly.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="mt-5 border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            Send another message
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C1A06E]">
              Get in touch
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Request a consultation
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Share your details and our advisors will reach out.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              placeholder="Your Name *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className={fieldClass}
            />
            <Input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className={fieldClass}
            />
            <Input
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className={fieldClass}
            />
            <Select
              value={formData.inquiry_type}
              onValueChange={(value) =>
                setFormData({ ...formData, inquiry_type: value })
              }
            >
              <SelectTrigger className={`${fieldClass} w-full`}>
                <SelectValue placeholder="Inquiry Type" />
              </SelectTrigger>
              <SelectContent>
                {inquiryTypes.map((inquiryType) => (
                  <SelectItem key={inquiryType.value} value={inquiryType.value}>
                    {inquiryType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={3}
              className={`${fieldClass} min-h-[88px] resize-none`}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-[#C1A06E] font-semibold text-slate-950 hover:bg-[#a88b5e]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Inquiry
                </>
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
