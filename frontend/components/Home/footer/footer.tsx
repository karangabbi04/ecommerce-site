"use client";

import Link from "next/link";
import type { Route} from "next";
import * as Icons from "react-icons/fa6";
import { FaInstagram as InstagramIcon } from "react-icons/fa6";

import Newsletter from "./newsletter";
import {  footerSections, socialLinks } from "./footer-data";

const socialIcons = {
  Instagram: (Icons as any).FaInstagram,
  Twitter: (Icons as any).FaTwitter,
  Linkedin: (Icons as any).FaLinkedin,
  Facebook: (Icons as any).FaFacebook,
};

console.log("socialIcons", socialIcons);
console.log("socialLinks", InstagramIcon);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (

    <footer className="relative overflow-hidden border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Top Section */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link
              href="/"
              className="inline-flex items-center text-2xl font-bold tracking-tight text-white"
            >
              VetriGlass
            </Link>

            <p className="max-w-xs text-sm leading-7 text-zinc-400">
              Transforming discarded glass into beautifully crafted,
              sustainable lifestyle products for a greener future.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons];

                return (
                  <Link
                    key={social.label}
                    href={social.href as Route}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="rounded-full border border-zinc-800 p-2 transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer Navigation */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-base font-semibold text-white">
                {section.title}
              </h3>

              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href as Route} 
                      className="text-sm text-zinc-400 transition-all duration-300 hover:translate-x-1 hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <Newsletter />
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t border-zinc-800 pt-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear}{" "}
            <span className="font-medium text-zinc-300">VetriGlass</span>. All
            rights reserved.
          </p>

          <p>
            Crafted with ❤️ for a more sustainable tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
}