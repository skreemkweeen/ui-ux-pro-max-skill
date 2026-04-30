'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname }             from 'next/navigation'
import { pageTransition }          from '@/lib/motion'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={{
          initial: pageTransition.initial,
          enter:   pageTransition.enter,
          exit:    pageTransition.exit,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
