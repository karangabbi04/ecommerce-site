"use client";

import { useMemo } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import ProductGallery from "@/components/singleProduct/ProductGallery";
import ProductInfo from "@/components/singleProduct/ProductInfo";
import RecommendedProducts from "@/components/singleProduct/RecommendedProducts";
import { useProductById } from "@/hooks/queries/use-products";

import { useQuantity } from "@/hooks/useQuantity";
import { useProducts } from "@/hooks/queries/use-products";


export default function ProductPage() {
 const params = useParams();

  const productId = params.id as string;

  // const quantity = useQuantity();
  const quantity = useQuantity();
   const {
  data: productsData,
  isLoading,
} = useProducts({
  page: 1,
  limit: 8,
});

  const {
    data: product,
    isLoading:isproductLoading,
    isError,
    error,
  } = useProductById(productId);

  if (isproductLoading) {
    return null;
  }

  if (isError) {
    throw error;
  }

  if (!product) {
    notFound();
  }





 
  
  

  const recommendedProducts =
  productsData?.products?? [];
  // const recommendedProducts =
  //   product.recommendedProducts ?? [];

    return (
    <main className="min-h-screen flex justify-center bg-background">
      <div className="container py-8 lg:py-12">
        {/* Breadcrumb */}
        {/* TODO: Replace with reusable Breadcrumb component */}
        <div className="mb-8">
          {/* <ProductBreadcrumb product={product} /> */}
        </div>

        {/* Product Section */}
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductGallery
            images={product.images}
            productName={product.name}
          />

          <ProductInfo
            product={product}
            quantity={quantity}
          />
        </section>

        {/* 3D / AR Experience */}
        {/* <section className="mt-20">
          <ProductExperience
            has3D={Boolean(product.modelUrl)}
            hasAR={Boolean(product.arUrl)}
            modelUrl={product.modelUrl}
            arUrl={product.arUrl}
          />
        </section>  */}

        {/* Recommended Products */}
        <RecommendedProducts
          products={recommendedProducts}
        />
      </div>
    </main>
  );
}