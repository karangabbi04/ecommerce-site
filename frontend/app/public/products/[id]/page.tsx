"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/app/store/product.store";
import Link from "next/link";


export default function ProductDetailPage() {
    const params = useParams();
 const id = params.id as string;


  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [showAR, setShowAR] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview");
  const [quantity, setQuantity] = useState(1);

const activeImage =
  selectedProduct?.images?.[selectedImageIndex]?.url || "/placeholder.png";

const discount = selectedProduct?.oldPrice
  ? Math.round(
      ((selectedProduct.oldPrice - selectedProduct.price) /
        selectedProduct.oldPrice) *
        100
    )
  : 0;


useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);
  console.log("Selected Product:", selectedProduct);

  if (isLoading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!selectedProduct) return <p>Product not found</p>;


  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#f5f5f7] via-white to-[#f5f5f7] text-zinc-950">
      <section className="relative px-6 pb-24 pt-10 md:pt-16">
        <div className="absolute left-[-10rem] top-20 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-[-10rem] top-36 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
            <Link href="/public/products" className="relative z-10">
          <button

            type="button"
            className="mb-8 rounded-full border border-zinc-200 bg-white/70 px-5 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur-xl transition hover:bg-white"
          >
            ← Back to products
          </button>
          </Link>

          <div className="grid  gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            {/* PRODUCT VISUAL */}
            <div className="rounded-[2.5rem] bg-green-500  border border-white/80 bg-white/60 p-4 pt-6 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-6">
              <div className="grid  lg:grid-cols-[5.5rem_1fr]">
                {/* DESKTOP VERTICAL THUMBNAILS */}
                <div className="hidden  w-18 lg:flex lg:flex-col gap-3">
                  {selectedProduct.images?.map((img, index) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`group overflow-hidden rounded-2xl border bg-white/70 p-1 transition ${
                        selectedImageIndex === index
                          ? "border-zinc-950 shadow-lg"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                        className="h-15 w-full rounded-xl object-cover transition duration-300 group-hover:scale-110"
                      />
                    </button>
                  ))}
                </div>

                {/* MAIN IMAGE */}
                <div
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  className={`relative  flex min-h-[32rem] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br ${selectedProduct.color}`}
                >
                  <div className="absolute inset-8 rounded-[2rem] border border-white/70 bg-white/30 backdrop-blur-xl" />
                  <div className="absolute left-6 top-6 z-10 rounded-full bg-white/75  text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur-xl">
                    {selectedProduct.tag}
                  </div>
                  

                  <img
                    src={activeImage}
                    alt={`${selectedProduct.name} preview`}
                    className={`relative h-[100%] max-h-[31rem] w-full rounded-2xl object-cover shadow-2xl transition duration-700 ${
                      isZoomed ? "scale-110" : "scale-100"
                    }`}
                  />
                </div>
              </div>

              {/* MOBILE / TABLET IMAGE GALLERY */}
              <div className="mt-5 flex gap-3 overflow-x-auto pb-2 lg:hidden">
                {selectedProduct.images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 overflow-hidden rounded-xl border bg-white/70 p-1 transition ${
                      selectedImageIndex === index
                        ? "border-zinc-950 shadow-lg"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                      className="h-24 w-20 rounded-lg object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4">

              </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="lg:sticky lg:top-8">
              <div className="rounded-[2.5rem] border border-white/80 bg-white/70 p-7 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    {selectedProduct.category}
                  </span>
                  {discount > 0 ? (
                    <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">
                      Save {discount}%
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                  {selectedProduct.name}
                </h1>

                <p className="mt-4 text-lg leading-8 text-zinc-600">
                  {selectedProduct .description}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                      activeTab === "overview"
                        ? "bg-zinc-950 text-white"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                      activeTab === "details"
                        ? "bg-zinc-950 text-white"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    Details
                  </button>
                </div>

               

                <div className="mt-7 flex items-end gap-3">
                  <span className="text-4xl font-semibold">₹{selectedProduct.price}</span>
                  {selectedProduct.oldPrice ? (
                    <span className="pb-1 text-lg text-zinc-400 line-through">₹{selectedProduct.oldPrice}</span>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <div className="flex w-full items-center justify-between rounded-full border border-zinc-200 bg-white px-5 py-3 sm:w-36">
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      className="text-xl font-medium text-zinc-500"
                    >
                      −
                    </button>
                    <span className="font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((value) => value + 1)}
                      className="text-xl font-medium text-zinc-950"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="flex-1 rounded-full bg-zinc-950 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-zinc-950/15 transition hover:scale-[1.02] hover:bg-zinc-800"
                  >
                    Add to Cart
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAR(true)}
                  className="mt-4 w-full rounded-full border border-zinc-200 bg-white px-7 py-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:scale-[1.02] hover:bg-zinc-50"
                >
                  View in AR
                </button>

                
              </div>
            </div>
          </div>

          {/* SUGGESTED PRODUCTS */}
          <section className="mt-20">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
                Recommended
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                New product suggestions.
              </h2>
              <p className="mt-3 max-w-xl text-zinc-600">
                Products that match the same handmade, recycled-glass story.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* {suggested.map((item) => (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-900/10 before:pointer-events-none before:absolute before:inset-y-0 before:left-[-120%] before:z-20 before:w-1/2 before:skew-x-[-18deg] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent before:transition-all before:duration-700 hover:before:left-[140%]"
                >
                  <div className="grid gap-5 sm:grid-cols-[12rem_1fr] sm:items-center">
                    <div className={`flex h-48 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${item.color}`}>
                      <div className="h-28 w-16 rounded-b-[2rem] rounded-t-xl bg-white/60 shadow-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                        {item.category}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{item.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">{item.desc}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-lg font-semibold">₹{item.price}</p>
                        <button
                          type="button"
                          onClick={() => {
                            const index = products.findIndex((productItem) => productItem.id === item.id);
                            setSelectedProductIndex(index);
                            setSelectedImageIndex(0);
                            setActiveTab("overview");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105"
                        >
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))} */}
            </div>
          </section>
        </div>
      </section>

      {/* AR MODAL */}
      {showAR ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white p-6 text-center shadow-2xl">
            <div className="absolute right-[-5rem] top-[-5rem] h-60 w-60 rounded-full bg-emerald-200/50 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
                AR Preview
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">View in your space.</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Demo AR preview. Real AR can be integrated later using model-viewer or Three.js.
              </p>

              <div className={`mt-6 flex h-72 items-center justify-center rounded-[1.5rem] bg-gradient-to-br `}>
                <div className="h-44 w-24 rounded-b-[3rem] rounded-t-2xl bg-white/60 shadow-2xl" />
              </div>

              <button
                type="button"
                onClick={() => setShowAR(false)}
                className="mt-6 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
