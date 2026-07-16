"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export function ContactInfo() {
  const infoItems = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone Line",
      value: "+09 012-345-6789",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Support Email",
      value: "hello@foremost.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Main Office",
      value: "J. Roya Ubud No.70, Ubud - Bali",
    },
  ];

  const socialLinks = [
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
        </svg>
      ),
      label: "Linkedin",
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      label: "Twitter (x)",
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      ),
      label: "Facebook",
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
      label: "Instagram",
    },
  ];

  return (
    <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col gap-6 select-none">
      <div className="pb-3 border-b border-gray-50">
        <h3 className="font-heading text-lg font-black text-gray-900 uppercase">
          Contact Information
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        {infoItems.map((item, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316] flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                {item.label}
              </span>
              <p className="text-xs font-black text-gray-800 mt-0.5 leading-relaxed">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-gray-50">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect With Us</span>
        <div className="flex flex-wrap gap-2.5">
          {socialLinks.map((social, i) => (
            <a
              key={i}
              href="#"
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-655/80 transition-colors border border-gray-250/20"
              title={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
