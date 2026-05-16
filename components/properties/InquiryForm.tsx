"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Send, Loader2, CheckCircle2, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  FALLBACK_PROPERTY_OPTIONS,
  normalizeSelectOptions,
  SelectOption,
} from "@/constants/form-options";

interface Property {
  title?: string;
  referenceNumber?: string;
  _id?: string;
}

interface InquiryFormProps {
  property: Property;
}

export default function InquiryForm({ property }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry_type: "general",
    message: `I'm interested in ${property?.title || "this property"}. Please contact me with more details.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryTypes, setInquiryTypes] = useState<SelectOption[]>(
    FALLBACK_PROPERTY_OPTIONS.inquiryTypes,
  );

  React.useEffect(() => {
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
      } catch (error) {
        // Keep fallback types
      }
    };
    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiryData = {
        ...formData,
        property_title: property?.title,
        property_reference: property?.referenceNumber,
        property_id: property?._id,
      };

      const response = await api.createInquiry(inquiryData);

      if (response.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success("Inquiry submitted successfully!");
      } else {
        setIsSubmitting(false);
        toast.error(
          response.message || "Failed to submit inquiry. Please try again.",
        );
      }
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(
        error.message || "Failed to submit inquiry. Please try again.",
      );
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </motion.div>
          <h3 className="text-xl font-semibold text-primary-dark mb-2">
            Thank You!
          </h3>
          <p className="text-gray-600 mb-6">
            Your inquiry has been submitted successfully. One of our advisors
            will contact you shortly.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                inquiry_type: "general",
                message: `I'm interested in ${property?.title || "this property"}. Please contact me with more details.`,
              });
            }}
            variant="outline"
          >
            Submit Another Inquiry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-lg">Interested in this property?</CardTitle>
        <p className="text-sm text-gray-500">
          Fill out the form and we&apos;ll get back to you
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Your Name *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="h-12"
            />
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="h-12"
            />
          </div>

          <div>
            <Input
              placeholder="Phone Number (e.g., +971 50 123 4567) *"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="h-12"
            />
          </div>

          <div>
            <Select
              value={formData.inquiry_type}
              onValueChange={(value) =>
                setFormData({ ...formData, inquiry_type: value })
              }
            >
              <SelectTrigger className="h-12 w-full">
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
          </div>

          <div>
            <Textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
            />
          </div>

          {property?.referenceNumber && (
            <p className="text-xs text-gray-400">
              Reference: {property.referenceNumber}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-[#C1A06E] hover:bg-[#A68B5B] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Inquiry
              </>
            )}
          </Button>
        </form>

        {/* Quick Contact */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center mb-4">
            Or call us directly
          </p>
          <a href="tel:+97145551234">
            <Button variant="outline" className="w-full h-12 border-primary-dark">
              <Phone className="w-4 h-4 mr-2" />
              +971 4 555 1234
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
