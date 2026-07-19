"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const slideImages = [
  "/image/athlete.png",
  "/image/athlete2.png",
  "/image/athlete3.png"
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000); // Slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[600px] lg:min-h-[800px] flex items-center bg-black overflow-hidden">
      {/* Background Image (Stadium) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/hero-bg.jpg"
          alt="Stadium Background"
          fill
          sizes="100vw"
          className="object-cover opacity-60"
          priority
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-20 flex flex-col md:flex-row items-center">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start mt-12">
          <h1 className="font-heading text-6xl md:text-8xl font-bold text-white leading-[1] uppercase tracking-tight">
            Wear What<br />You <span className="text-primary">Design.</span>
          </h1>
          <p className="mt-6 text-gray-300 max-w-md text-base md:text-lg">
            From your team colors to custom logos, build your complete uniform in seconds. High quality fabrics, fast turnaround.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/customize">
              <Button className="font-bold tracking-wide px-8 h-12 text-base font-heading w-full sm:w-auto" size="lg">
                Start Designing &rarr;
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 px-8 h-12 text-base font-heading cursor-pointer flex items-center justify-center"
              size="lg"
              render={<Link href="/teams-and-bulk" />}
              nativeButton={false}
            >
              Request a Quote
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 flex gap-12 border-t border-white/10 pt-6">
            <div>
              <p className="text-primary font-bold text-3xl font-heading">200K+</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Items Delivered</p>
            </div>
            <div>
              <p className="text-primary font-bold text-3xl font-heading">48H</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Custom Turnaround</p>
            </div>
            <div>
              <p className="text-primary font-bold text-3xl font-heading flex items-center gap-1">
                5.0 <span className="text-lg">★</span>
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Customer Rating</p>
            </div>
          </div>
        </div>

        {/* Right Content - Athlete Image Slider */}
        <div className="w-full md:w-1/2 relative h-[500px] lg:h-[724px] hidden md:block">
          {slideImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Athlete wearing custom jersey ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-contain object-bottom mix-blend-lighten transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              priority={index === 0}
            />
          ))}
          
          {/* Slider Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slideImages.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? "bg-[#EF892A]" : "bg-white/30 hover:bg-white/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
