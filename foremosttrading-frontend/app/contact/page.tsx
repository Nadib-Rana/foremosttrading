import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactInfo } from "@/features/contact/components/ContactInfo";
import { ContactForm } from "@/features/contact/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col justify-between">
      <div>
        {/* Light theme Navbar */}
        <Navbar theme="light" />

        {/* Hero Section */}
        <section className="bg-white border-b border-gray-100 py-16 md:py-20 select-none">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <span className="text-[10px] font-heading font-black tracking-[0.25em] text-[#EF892A] uppercase mt-0.5 italic">
              GET IN TOUCH
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-gray-900 tracking-tight mt-3">
              We Are Here To Help
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mt-4 max-w-xl mx-auto">
              Have questions about your custom order, shipping turnarounds, or corporate design proofs? Connect with our support team or send us a message below.
            </p>
          </div>
        </section>

        {/* Contact Info & Contact Form side-by-side */}
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 select-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Contact Info (1 column) */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
            
            {/* Contact Form (2 columns) */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
