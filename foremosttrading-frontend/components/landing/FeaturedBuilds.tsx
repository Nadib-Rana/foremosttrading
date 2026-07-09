import Image from "next/image";
import { Button } from "@/components/ui/button";

const builds = [
  {
    title: "Varsity Letterman-Classic",
    subtitle: "The icon. Wool body, leather sleeves, snap front",
    originalPrice: "599",
    price: "189",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop", // Yellowish theme
  },
  {
    title: "Pro Basketball Jersey",
    subtitle: "Tournament-grade mesh. Sublimated team id...",
    originalPrice: "299",
    price: "149",
    image: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=800&auto=format&fit=crop", // Black jersey
  },
  {
    title: "Gridiron Football Jersey",
    subtitle: "Reinforced shoulders. Pro-cut fit.",
    originalPrice: "685",
    price: "399",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop", // Red jersey
  },
];

export function FeaturedBuilds() {
  return (
    <section className="w-full py-16 md:py-24 bg-[#F4F5F7]">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-black mb-10">
          Featured Builds
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {builds.map((build, i) => (
            <div key={i} className="group cursor-pointer bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={build.image}
                  alt={build.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay Button (visible on hover) */}
                <div className="absolute bottom-4 left-0 w-full px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Button className="w-full h-12 bg-[#111] hover:bg-black text-white rounded-md font-semibold text-sm">
                    Customize It
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="mt-5 px-1 pb-2">
                <h3 className="font-bold text-lg md:text-xl text-black uppercase leading-tight">
                  {build.title}
                </h3>
                <p className="text-gray-500 text-sm md:text-base mt-1 line-clamp-1">
                  {build.subtitle}
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-gray-500 font-bold text-sm line-through">
                    ${build.originalPrice}
                  </span>
                  <span className="text-black font-bold text-lg">
                    ${build.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
