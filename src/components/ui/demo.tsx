"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

function HoverFooter(): JSX.Element {
  const footerLinks = [
    {
      title: "Explore",
      links: [
        { label: "Works", href: "/works" },
        { label: "Services", href: "/services" },
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" }
      ]
    }
  ];

  return (
    <footer className="relative m-8 h-fit overflow-hidden rounded-3xl border border-border/20 bg-card/76">
      <div className="relative z-10 mx-auto max-w-7xl p-10 md:p-14">
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accentA" />
              <span className="text-2xl font-semibold text-fg">Graphxify</span>
            </div>
            <p className="text-sm leading-relaxed text-fg/72">
              Structured brand systems and high-performance websites built to scale.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-6 text-lg font-semibold text-fg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="inline-flex items-center gap-1.5 text-fg/72 transition-colors hover:text-accentA">
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-6 text-lg font-semibold text-fg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-fg/76">
                <Mail size={18} className="text-accentA" />
                <a href="mailto:info@graphxify.com" className="hover:text-accentA">
                  info@graphxify.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-fg/76">
                <Phone size={18} className="text-accentA" />
                <a href="tel:+16475700334" className="hover:text-accentA">
                  +1 (647) 570-0334
                </a>
              </li>
              <li className="flex items-center space-x-3 text-fg/76">
                <MapPin size={18} className="text-accentA" />
                <span>Mississauga, Ontario</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-t border-border/20" />

        <div className="flex flex-col items-center justify-between space-y-4 text-sm md:flex-row md:space-y-0">
          <p className="text-center text-fg/66 md:text-left">&copy; {new Date().getFullYear()} Graphxify. All rights reserved.</p>
        </div>
      </div>

      <div className="hidden h-[20rem] lg:flex">
        <TextHoverEffect text="Graphxify" className="z-10" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
