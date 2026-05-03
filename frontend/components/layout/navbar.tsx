"use client";

import { useState } from "react";

export default function NavbarPreview() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = {
    name: "Karan",
    isLoggedIn: true,
  };

  const userLocation = "Ludhiana, PB";
  const cartCount = 3;

  return (
   
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/70 backdrop-blur-2xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* LOGO */}
          <a href="#" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-lg font-bold text-white shadow-lg shadow-zinc-950/20 transition group-hover:scale-105">
              V
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight text-zinc-950">
                VetriGlass
              </p>
              <p className="text-xs text-zinc-500">Recycled glass craft</p>
            </div>
          </a>

          {/* DESKTOP LINKS */}
         

          {/* RIGHT SIDE */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-white"
            >
              <span>📍</span>
              <span>{userLocation}</span>
            </button>

            <a
              href="#"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/70 text-lg shadow-sm transition hover:scale-105 hover:bg-white"
            >
              🛒
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1 text-xs font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </a>

            {user.isLoggedIn ? (
              <a
                href="#"
                className="flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-zinc-950/15 transition hover:scale-105 hover:bg-zinc-800"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-zinc-950">
                  {user.name.charAt(0)}
                </span>
                {user.name}
              </a>
            ) : (
              <a
                href="#"
                className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-950/15 transition hover:scale-105 hover:bg-zinc-800"
              >
                Login
              </a>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl md:hidden"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {isMenuOpen ? (
          <div className="border-t border-zinc-200 bg-white px-6 py-5 md:hidden">
            <div className="space-y-4">
              <a href="#" className="block text-sm font-medium text-zinc-700">Products</a>
              <a href="#" className="block text-sm font-medium text-zinc-700">About</a>
              <a href="#" className="block text-sm font-medium text-zinc-700">Contact</a>

              <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                📍 {userLocation}
              </div>

              <a href="#" className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 text-sm font-medium text-zinc-700">
                <span>Cart</span>
                <span className="rounded-full bg-zinc-950 px-2 py-1 text-xs text-white">
                  {cartCount}
                </span>
              </a>

              <a href="#" className="block rounded-full bg-zinc-950 px-5 py-3 text-center text-sm font-semibold text-white">
                Account: {user.name}
              </a>
            </div>
          </div>
        ) : null}
      </header>


  );
}
