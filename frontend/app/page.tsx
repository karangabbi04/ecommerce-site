import HeroSection from "@/components/Home/heroSection/heroSection";
import FeaturedProducts from "@/components/Home/feature-product/featured-products";
import WhyChooseUs from "@/components/Home/why-choose-us/why-choose-us";
import Testimonial from "@/components/Home/testimonial/index";
import Footer from "@/components/Home/footer/footer";

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
