import { FooterSection, SocialLink } from "./types"

export const footerSections: FooterSection[] = [
  {
    title: "Explore",
    links: [
      {
        label: "Shop",
        href: "/shop",
      },
      {
        label: "Collections",
        href: "/collections",
      },
      {
        label: "New Arrivals",
        href: "/new-arrivals",
      },
      {
        label: "Best Sellers",
        href: "/best-sellers",
      },
    ],
  },

  {
    title: "Company",
    links: [
      {
        label: "About Us",
        href: "/about",
      },
      {
        label: "Contact",
        href: "/contact",
      },
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        label: "Terms & Conditions",
        href: "/terms",
      },
    ],
  },

  {
    title: "Support",
    links: [
      {
        label: "FAQs",
        href: "/faq",
      },
      {
        label: "Shipping",
        href: "/shipping",
      },
      {
        label: "Returns",
        href: "/returns",
      },
      {
        label: "Help Center",
        href: "/support",
      },
    ],
  },
]

export const socialLinks: SocialLink[] = [
  {
      label: "Instagram",
      href: "https://instagram.com",
      external: true,
      icon: "Instagram",
  },
  {
      label: "Facebook",
      href: "https://facebook.com",
      external: true,
      icon: "Facebook",
  },
  {
      label: "LinkedIn",
      href: "https://linkedin.com",
      external: true,
      icon: "Linkedin",
  },
  {
      label: "X",
      href: "https://x.com",
      external: true,
      icon: "Twitter",
  },
]

export const companyInfo = {
  name: "VetriGlass",

  description:
    "Transforming discarded glass into premium, sustainable products crafted for modern living.",

  copyright: `© ${new Date().getFullYear()} VetriGlass. All rights reserved.`,
}