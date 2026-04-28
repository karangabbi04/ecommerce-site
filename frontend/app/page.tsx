import HeroSection from "@/components/section/HeroSection";
import FeaturedProducts from "@/components/section/FeaturedProducts";
import WhyChooseUs from "@/components/section/WhyChooseUs";
import Testimonial from "@/components/section/Testimonial";
import Footer from "@/components/section/Footer";
import { Feature } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <main className="relative overflow-hidden bg-gradient-to-b from-[#f5f5f7] via-white to-[#f5f5f7] text-zinc-950">
   <HeroSection />
   <FeaturedProducts />
   <WhyChooseUs />
   <Testimonial />
   <Footer />
    </main>
   </>
  );
}
