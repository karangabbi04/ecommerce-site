import React from 'react'

interface Props {}

function Footer(props: Props) {
    const {} = props

    return (
        <footer className="relative overflow-hidden bg-zinc-950 py-20 text-white">
        <div className="absolute left-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-8rem] h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <h3 className="text-2xl font-semibold">VetriGlass</h3>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                Reimagining waste into premium everyday objects.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Explore</h4>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>Shop</li>
                <li>Collections</li>
                <li>New Arrivals</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Join the vibe</h4>
              <p className="mt-3 text-sm text-zinc-400">
                Get updates on new drops.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="min-w-0 flex-1 rounded-full px-4 py-2 text-sm text-black outline-none"
                />
                <button
                  type="button"
                  className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:scale-105"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-500">
            © 2026 VetriGlass. Designed to stand out.
          </div>
        </div>
      </footer>
    )
}

export default Footer
