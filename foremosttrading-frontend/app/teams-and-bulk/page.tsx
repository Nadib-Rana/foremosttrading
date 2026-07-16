import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCalculator } from "@/features/teams-and-bulk/components/PricingCalculator";
import { BulkInquiryForm } from "@/features/teams-and-bulk/components/BulkInquiryForm";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function TeamsAndBulkPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col justify-between">
      <div>
        {/* Light theme Navbar */}
        <Navbar theme="light" />

        {/* Hero Section */}
        <section className="bg-white border-b border-gray-100 py-16 md:py-20 select-none">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <span className="text-[10px] font-heading font-black tracking-[0.25em] text-[#F97316] uppercase mt-0.5 italic">
              VOLUME ORDERS
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-gray-900 tracking-tight mt-3">
              Equip Your Squad In Premium Custom Wear
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mt-4 max-w-xl mx-auto">
              Whether you are outfitting a school club, local league team, or global corporate crew, Foremost delivers high-performance customized apparel with unmatched bulk pricing.
            </p>
          </div>
        </section>

        {/* Core Benefits */}
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316] flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-xs font-black text-gray-900 uppercase">Volume Discounts</h3>
                <p className="text-[10px] font-semibold text-gray-500 mt-1 leading-normal">
                  Scale your squad orders to unlock discount tiers ranging from 5% to 30% off standard eCommerce retail pricing.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-xs font-black text-gray-900 uppercase">Premium Quality</h3>
                <p className="text-[10px] font-semibold text-gray-500 mt-1 leading-normal">
                  Enjoy customizable details with wool body shells, leather sleeves, heavy performance poly fabrics, and detailed embroidery.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316] flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-xs font-black text-gray-900 uppercase">Rapid Delivery</h3>
                <p className="text-[10px] font-semibold text-gray-500 mt-1 leading-normal">
                  Each volume order receives priority routing in our fabrication facilities, securing quick turnarounds and tracking updates.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Inquiry form workspace grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-12">
            <PricingCalculator />
            <BulkInquiryForm />
          </div>
        </section>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
