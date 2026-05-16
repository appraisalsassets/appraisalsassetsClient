"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  FALLBACK_PROPERTY_OPTIONS,
  normalizeSelectOptions,
  SelectOption,
} from "@/constants/form-options";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry_type: "general",
    message: "",
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
      const response = await api.createInquiry(formData);

      if (response.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success("Message sent successfully!");
      } else {
        setIsSubmitting(false);
        toast.error(
          response.message || "Failed to send message. Please try again.",
        );
      }
    } catch (error: unknown) {
      setIsSubmitting(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[55vh] lg:h-[60vh] mt-36 bg-primary-dark py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=2000"
            alt="Dubai"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-[#C1A06E]/20 border border-[#C1A06E]/30 rounded-full text-[#C1A06E] text-sm font-medium mb-6">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Information
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Visit our office or reach out through any of our channels. Our
              professional real estate agents in Dubai are available 7 days a
              week to assist you with property inquiries, investments, and real
              estate management Dubai. We are committed to delivering reliable
              and responsive real estate services in Dubai.
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-primary-dark mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-8">
                  Visit our office or reach out through any of the channels
                  below. We&apos;re available 7 days a week to assist you.
                </p>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#C1A06E]/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#C1A06E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-1">
                      Office Address
                    </h4>
                    <p className="text-gray-600">
                      Office No: 79 Al Fahidi
                      <br />
                      St - Al Hamriya - Bur Dubai
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-start gap-4"
                  >
                  <div className="w-12 h-12 bg-[#C1A06E]/10 rounded-xl flex items-center justify-center shrink-0">  
                    <Phone className="w-6 h-6 text-[#C1A06E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-1">Phone</h4>
                    <a
                      href="tel:+971502828397" // Ensure this matches your full 10-digit mobile number
                      className="text-gray-600 hover:text-[#C1A06E] transition-colors"
                      >
                      +971-50-282-8397
                    </a>
                    <br />
                    <a
                      href="tel:+97142885213"
                      className="text-gray-600 hover:text-[#C1A06E] transition-colors"
                      >
                      +971-4-288-5213
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#C1A06E]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#C1A06E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-1">Email</h4>
                    <a
                      href="mailto:info@assetsappraisals.com"
                      className="text-gray-600 hover:text-[#C1A06E] transition-colors"
                    >
                      info@assetsappraisals.com
                    </a>
                    <br />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#C1A06E]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-[#C1A06E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-1">
                      Working Hours
                    </h4>
                    <p className="text-gray-600">
                      Sunday - Thursday: 9:00 AM - 6:00 PM
                      <br />
                      Friday - Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </motion.div>
              </div>

             {/* Social Links */}
              <div className="pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-primary-dark mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/assetsnappraisalsre/"
                    className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center text-white hover:bg-[#C1A06E] transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/assetsnappraisalsre"
                    className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center text-white hover:bg-[#C1A06E] transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/assets-appraisals-497626402/"
                    className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center text-white hover:bg-[#C1A06E] transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/appraisals_real"
                    className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center text-white hover:bg-[#C1A06E] transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>



            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-primary-dark mb-2">
                        Thank You!
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Your message has been received. One of our advisors will
                        get back to you within 24 hours.
                      </p>
                      <Button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            inquiry_type: "general",
                            message: "",
                          });
                        }}
                        variant="outline"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-primary-dark mb-2">
                        Send us a Message
                      </h3>
                      <p className="text-gray-600 mb-8">
                        Fill out the form below and we&apos;ll get back to you
                        shortly.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Full Name *
                            </label>
                            <Input
                              placeholder="Your full name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              required
                              className="h-12"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Email Address *
                            </label>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              required
                              className="h-12"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Phone Number *
                            </label>
                            <Input
                              placeholder="+971-50-282-8397 | + 971-4-288-5213"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              }
                              required
                              className="h-12"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Inquiry Type
                            </label>
                            <Select
                              value={formData.inquiry_type}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  inquiry_type: value,
                                })
                              }
                            >
                              <SelectTrigger className="h-12 w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {inquiryTypes.map((inquiryType) => (
                                  <SelectItem
                                    key={inquiryType.value}
                                    value={inquiryType.value}
                                  >
                                    {inquiryType.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Message *
                          </label>
                          <Textarea
                            placeholder="Tell us about your requirements..."
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            required
                            rows={5}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-14 bg-[#C1A06E] hover:bg-[#A68B5B] text-white text-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178505983791!2d55.2747!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          // allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
