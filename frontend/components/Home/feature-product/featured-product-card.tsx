import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type FeaturedProduct = {
  name: string;
  description: string;
  price: string;
  tag: string;
  gradient: string;
  image: string;
};

interface FeaturedProductCardProps {
  product: FeaturedProduct;
}

export function FeaturedProductCard({
  product,
}: FeaturedProductCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-[2rem] border-zinc-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-900/10">
      <CardHeader className="p-0">
        <div
          className={`relative flex h-72 items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${product.gradient}`}
        >
          <div className="absolute inset-6 rounded-[1.5rem] border border-white/70 bg-white/35 backdrop-blur-xl" />

          <div className="absolute left-5 top-5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur-xl">
            {product.tag}
          </div>

          <div className="relative  rounded-b-[2.5rem] rounded-t-2xl border border-white/90 bg-white/45 shadow-2xl backdrop-blur-md">
           
                    <Image
                  src={product.image}
                  width={400}
                  height={600 }
                  alt="" />

          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-3 pt-5">
        <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
          {product.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-3 pb-3 pt-2">
        <span className="text-lg font-semibold text-zinc-950">
          {product.price}
        </span>

        <Button size="sm" className="rounded-full">
          View
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}