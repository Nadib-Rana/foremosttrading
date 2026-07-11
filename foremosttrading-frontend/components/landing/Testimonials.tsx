import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "\"The configurator is unreal. Our entire roster designed their own warm-ups in one afternoon.\"",
    name: "Atif Islam",
    title: "Eastside HS Basketball",
  },
  {
    quote:
      "\"Wool body, leather sleeves, chenille patches exactly how a varsity jacket should feel.\"",
    name: "Sanjay M.",
    title: "Captain, TRACK",
  },
  {
    quote:
      "\"Bulk ordering was painless. 80 uniforms, every name and number correct.\"",
    name: "Emma L.",
    title: "Athletics Director",
  },
];

export function Testimonials() {
  return (
    <section className="w-full py-8 md:py-12 bg-[#F4F5F7]">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-black mb-10">
          FROM THE FIELD
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="flex flex-col bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 fill-[#F97316] text-[#F97316]"
                  />
                ))}
              </div>
              <p className="text-[#4B5563] text-sm leading-relaxed mb-6 flex-grow">
                {testimonial.quote}
              </p>
              <div>
                <p className="font-bold text-black text-sm">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-xs mt-1">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
