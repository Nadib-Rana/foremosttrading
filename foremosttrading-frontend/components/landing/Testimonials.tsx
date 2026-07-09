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
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-black mb-12">
          From The Field
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-5 h-5 fill-[#FBBF24] text-[#FBBF24]"
                  />
                ))}
              </div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                {testimonial.quote}
              </p>
              <div>
                <p className="font-bold text-black text-lg">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
