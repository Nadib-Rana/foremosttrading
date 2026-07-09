import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Letterman\nJackets",
    image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Sweatsuits",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Shirt & Shorts\nSets",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "American\nFootball",
    image: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Basketball",
    image: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Baseball",
    image: "https://images.unsplash.com/photo-1508344928928-7137b29de216?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Cargo Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Dancing/Cheer",
    image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Jumpsuits",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Accessories",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
];

export function ShopTheLine() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-2">
            Shop The Line
          </h2>
          <p className="text-gray-500 text-lg md:text-xl">
            Ten categories. Infinite combinations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, i) => (
            <Link
              key={i}
              href={category.href}
              className="group relative block w-full aspect-[4/5] rounded-[10px] overflow-hidden bg-gray-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                <h3 className="text-white font-bold text-lg md:text-xl uppercase leading-tight whitespace-pre-line">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
