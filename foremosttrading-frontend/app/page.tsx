import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ShopTheLine } from "@/components/landing/ShopTheLine";
import { FeaturedBuilds } from "@/components/landing/FeaturedBuilds";
import { ProcessSteps } from "@/components/landing/ProcessSteps";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      
      {/* Landing Page Sections */}
      <Hero />
      
      {/* Other sections will go here: */}
      <ShopTheLine />
      <FeaturedBuilds />
      <ProcessSteps />
      <Features />
      <Testimonials />
      <CtaBanner />
      <Faq />

      <Footer />
    </main>
  );
}
