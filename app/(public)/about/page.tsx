"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Award,
  Users,
  Target,
  Eye,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import PageHero from "@/components/layout/PageHero";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We operate with complete transparency and ethical standards in all our dealings.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in every service we provide to our clients.",
  },
  {
    icon: Users,
    title: "Client Focus",
    description:
      "Your success is our priority. We tailor our services to meet your unique needs.",
  },
];

const achievements = [
  { value: "15+", label: "Years of Excellence" },
  { value: "2,500+", label: "Properties Sold" },
  { value: "AED 8B+", label: "Transaction Value" },
  { value: "98%", label: "Client Satisfaction" },
];

const services = [
  "Experienced real estate agents Dubai",
  "Leading real estate brokerage in Dubai services.",
  "Professional property consultants",
  "Strong local and international network",
  "Customer-focused approach",
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHero
        title="Dubai's Leading Real Estate Agency & Advisory Firm"
        description="Trusted real estate agents in Dubai offering expert property, investment, and management solutions across the UAE."
        backgroundImage="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000"
        backgroundAlt="Dubai Skyline"
        badge={
          <span className="mb-4 inline-block rounded-full border border-[#C5A572]/30 bg-[#C5A572]/20 px-4 py-2 text-sm font-medium text-[#C5A572]">
            About Luxe Properties
          </span>
        }
      />

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-[#C5A572] font-semibold tracking-wide text-sm uppercase">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mt-2 mb-6">
                About Our Real Estate Agency in Dubai
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded out of a vision to transform the property experience
                  we are a trusted real estate agency in Dubai which also
                  serves international clients. What started as a small firm
                  has grown into one of the top real estate companies in Dubai
                  known for our integrity, expertise and results.
                </p>
                <p>
                  Our team at the moment is made up of certified real estate
                  agents and experienced consultants in Dubai which between us
                  have a combined total of many years of experience in property
                  sales, investment advice, and real estate management. We see
                  each of our clients&#39; needs as unique and that is why we put
                  together customized solutions which are tailored to your
                  goals.
                </p>
                <p>
                  Whether you are in search of a luxury retreat, a family home,
                  or a smart commercial investment, our professional real estate
                  brokers in Dubai see that you make educated and sure footed
                  decisions at each step.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#C5A572]/10 rounded-lg">
                  <Shield className="w-5 h-5 text-[#C5A572]" />
                  <span className="font-medium text-primary-dark">
                    RERA Certified
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#C5A572]/10 rounded-lg">
                  <Award className="w-5 h-5 text-[#C5A572]" />
                  <span className="font-medium text-primary-dark">
                    Award-Winning Service
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#C5A572]/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#C5A572]" />
                  <span className="font-medium text-primary-dark">
                    15+ Years of Excellence
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                alt="Luxe Properties Team"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-primary-dark text-white rounded-xl p-6 shadow-xl">
                <p className="text-4xl font-bold text-[#C5A572]">15+</p>
                <p className="text-sm text-gray-300">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="w-14 h-14 bg-[#C5A572]/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-[#C5A572]" />
              </div>
              <h3 className="text-2xl font-bold text-primary-dark mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To deliver exceptional real estate services that exceed client
                expectations, providing expert guidance, accurate valuations,
                and strategic investment advice that empowers our clients to
                achieve their property goals in the UAE market.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="w-14 h-14 bg-[#C5A572]/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-[#C5A572]" />
              </div>
              <h3 className="text-2xl font-bold text-primary-dark mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and respected real estate advisory firm
                in the UAE, recognized for our integrity, market expertise, and
                unwavering commitment to creating value for our clients through
                innovative solutions and exceptional service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-[#C5A572]">
                  {stat.value}
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#C5A572] font-semibold tracking-wide text-sm uppercase">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mt-2">
              What Drives Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8"
              >
                <div className="w-16 h-16 bg-[#C5A572]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-[#C5A572]" />
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#C5A572] font-semibold tracking-wide text-sm uppercase">
                Our Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mt-2 mb-6">
                Comprehensive Real Estate Solutions in Dubai
              </h2>
              <div className="space-y-4 text-gray-600 mb-8">
                <p>
                  As a leading real estate agency in Dubai we present to you
                  full property solutions that cater to all of your
                  requirements. We are at your service whether you are a buyer,
                  seller, lessor or manager of property. Our Dubai based real
                  estate professionals see to it that your experience is smooth
                  and profitable at every step.
                </p>
                <p>
                  We have a reputation of a reliable real estate company that
                  provides professional support, transparent processes, and
                  sound guidance for your residential and commercial investments
                  in the UAE.
                </p>
                <p>
                  We have established ourselves as a top real estate agency in
                  Dubai which is a result of our dedicated service and market
                  knowledge which we put to work for you.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-[#C5A572] shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/properties">
                  <Button className="bg-[#C5A572] hover:bg-[#A68B5B] text-white">
                    View Properties
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-primary-dark">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800"
                alt="Luxury Property"
                width={800}
                height={600}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-dark">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Property Journey?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Contact our team of experts today and let us help you find your
            perfect property in Dubai.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-[#C5A572] hover:bg-[#A68B5B] text-white px-8"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
