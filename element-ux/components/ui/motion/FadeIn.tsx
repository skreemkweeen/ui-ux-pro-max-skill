'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASE } from '@/lib/motion'

interface FadeInProps {
  children:   React.ReactNode
  className?: string
  delay?:     number
  duration?:  number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?:  number
  once?:      boolean
  amount?:    number
}

export function FadeIn({
  children,
  className,
  delay     = 0,
  duration  = DURATION.base,
  direction = 'up',
  distance  = 18,
  once      = true,
  amount    = 0.15,
}: FadeInProps) {
  const shouldReduce = useReducedMotion()
  const d = shouldReduce ? 0 : distance

  const initial = {
    opacity: 0,
    x: direction === 'left'  ? -d : direction === 'right' ? d : 0,
    y: direction === 'up'    ?  d : direction === 'down'  ? -d : 0,
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: shouldReduce ? 0 : duration,
        ease:     EASE.enter,
        delay:    shouldReduce ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  )
}
