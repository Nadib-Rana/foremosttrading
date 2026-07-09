import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background text-gray-400 py-12 px-6 border-t border-white/10 mt-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <div className="mb-4">
            <Image src="/logo/Logo.png" alt="FOREMOST Logo" width={300} height={80} className="object-contain h-16 w-auto mix-blend-lighten" />
          </div>
          <p className="text-sm">Transforming Team Wear Forever.</p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4 font-heading tracking-wide">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition">Shop</a></li>
            <li><a href="#" className="hover:text-primary transition">Customize</a></li>
            <li><a href="#" className="hover:text-primary transition">Teams & Bulk</a></li>
            <li><a href="#" className="hover:text-primary transition">About</a></li>
            <li><a href="#" className="hover:text-primary transition">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4 font-heading tracking-wide">Social</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition">Instagram</a></li>
            <li><a href="#" className="hover:text-primary transition">Twitter (X)</a></li>
            <li><a href="#" className="hover:text-primary transition">Facebook</a></li>
            <li><a href="#" className="hover:text-primary transition">YouTube</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4 font-heading tracking-wide">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>hello@foremosttrading.com</li>
            <li>+1 (800) 123-4567</li>
            <li className="pt-2">123 Sports Ave, Suite 100<br/>New York, NY 10001</li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-12 pt-8 border-t border-white/10 text-xs text-center">
        &copy; {new Date().getFullYear()} FOREMOST. All rights reserved.
      </div>
    </footer>
  );
}
