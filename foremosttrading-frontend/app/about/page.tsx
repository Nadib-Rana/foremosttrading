import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandStats } from "@/features/about/components/BrandStats";
import { CompanyValues } from "@/features/about/components/CompanyValues";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col justify-between">
      <div>
        {/* Light theme Navbar */}
        <Navbar theme="light" />

        {/* Hero Section */}
        <section className="bg-white py-16 md:py-20 select-none border-b border-gray-100">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <span className="text-[10px] font-heading font-black tracking-[0.25em] text-[#F97316] uppercase mt-0.5 italic">
              OUR MISSION
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-gray-900 tracking-tight mt-3">
              Unleashing Creativity, Crafting Excellence
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mt-4 max-w-xl mx-auto">
              We build customizer ecosystems that allow teams, clubs, and schools to design and order premium bespoke athletic apparel without minimum constraints.
            </p>
          </div>
        </section>

        {/* Narrative / Brand Story Section */}
        <section className="max-w-3xl mx-auto px-6 py-16 text-center select-none">
          <h2 className="font-heading text-2xl font-black text-gray-900 tracking-tight mb-4">
            The Foremost Story
          </h2>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6">
            Founded with a vision to eliminate the barriers of traditional mass apparel production, Foremost established a bridge between dynamic browser customizers and high-end tailored fabrication. We believe that custom jerseys should carry the same elite material finish as off-the-shelf retail products.
          </p>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            By sourcing premium components (wool shells, real leather trims, heavy performance double-knit polyester) and employing meticulous sewing craftsmanship, we help teams wear their identities with pride and supreme quality.
          </p>
        </section>

        {/* Company Values Section */}
        <CompanyValues />

        {/* Brand Stats Section */}
        <BrandStats />

        {/* Bottom CTA Section */}
        <section className="bg-white border-t border-gray-100 py-16 text-center select-none">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-heading text-2xl font-black text-gray-900 tracking-tight">
              Ready to Design Your Legacy?
            </h2>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-3 max-w-md mx-auto">
              Try our live customizable preview engine and begin outfitting your squad with elite uniforms.
            </p>
            <div className="mt-6">
              <Button
                className="bg-[#F97316] hover:bg-[#EA580C] text-white py-6 px-8 rounded-xl font-bold tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0 text-xs w-full sm:w-auto mx-auto"
                render={<Link href="/customize" />}
                nativeButton={false}
              >
                <Sparkles className="w-4 h-4" />
                Customize Now
              </Button>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
