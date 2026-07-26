"use client";

import React, { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";

const faqs = [
  {
    question: "How long does production take?",
    answer:
      "Standard custom orders ship within 2 to 3 weeks after final design approval. Express production (7–10 business days) is also available for urgent team orders.",
  },
  {
    question: "What's the minimum order?",
    answer:
      "We accept orders of all sizes! There is typically no minimum for most standard items, but bulk orders receive better pricing.",
  },
  {
    question: "Can I upload my logo?",
    answer:
      "Yes, you can easily upload your custom logo in our configurator and place it anywhere on your apparel.",
  },
  {
    question: "Do you offer team discounts?",
    answer:
      "Yes, we offer substantial volume discounts for entire rosters and organizations. Request a bulk quote for more info.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="w-full py-8 md:py-12 bg-[#F4F5F7]">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-black">
            Questions,<br />Answered.
          </h2>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-6 flex flex-col cursor-pointer"
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-black">
                  {faq.question}
                </h3>
                <div className="text-[#64748B]">
                  {openIndex === index ? (
                    <MinusCircle className="w-5 h-5" />
                  ) : (
                    <PlusCircle className="w-5 h-5" />
                  )}
                </div>
              </div>
              
              {openIndex === index && (
                <div className="mt-4 text-gray-500 text-sm md:text-base leading-relaxed pr-8">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
