import Hero from "@/components/layout/home/Hero";
import HomeAdvisorySection from "@/components/layout/home/HomeAdvisorySection";
import About from "@/components/layout/home/About";
import WhyChooseUs from "@/components/layout/home/WhyChooseUs";
import CallToAction from "@/components/layout/home/CallToAction";
import Services from "@/components/layout/home/Services";
import FeaturedProp from "@/components/layout/home/FeaturedProp";
import TestimonialsSection from "@/components/layout/home/TestimonialsSection";
import LocationsSection from "@/components/layout/home/LocationsSection";

export default function Home() {
  return (
    <main className="pt-32">
      <Hero />
      <HomeAdvisorySection />
      <About />
      <FeaturedProp />
      <Services />
      <TestimonialsSection />
      <LocationsSection />
      <WhyChooseUs />
      <CallToAction />
    </main>
  );
}
