import React from 'react'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

interface Props {}

function ImgCard(props: Props) {
    const {} = props

    return (
        <section className=" flex justify-center  overflow-hidden  text-zinc-950">
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
            className="relative mt-16 w-full max-w-4xl"
          >
            <div className="rounded-[2.5rem] border  border-white/80  p-6  shadow-zinc-900/10 backdrop-blur-2xl md:p-10">
              <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
                <div className="text-left">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-3 py-1 text-xs font-medium text-white">
                    <Sparkles />
                    New Drop
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight md:text-4xl">
                    Reimagined Glass. Redefined Style.
                  </h2>

                  <p className="mt-4 text-[12px]  leading-7 text-zinc-600 md:text-base">
                    Every product is cut, polished, and finished by hand  <br />— giving discarded bottles a second life.
                  </p>
                </div>

                <div className=" w-fit">
                    <img className=" rounded-2xl w-fit " src="https://res.cloudinary.com/dug5p4xso/image/upload/v1778236802/main_kidr1b.jpg" alt="" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>
    )
}

export default ImgCard
