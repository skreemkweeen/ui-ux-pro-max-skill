'use client'

import { motion } from 'framer-motion'
import { stagger } from '@/lib/motion'

interface StaggerListProps {
  children:   React.ReactNode
  className?: string
  speed?:     'fast' | 'base' | 'slow'
  as?:        'ul' | 'ol' | 'div'
}

export function StaggerList({
  children,
  className,
  speed = 'base',
  as    = 'ul',
}: StaggerListProps) {
  const container =
    speed === 'fast' ? stagger.containerFast  :
    speed === 'slow' ? stagger.containerSlow  :
                       stagger.container

  const Tag = motion[as]

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Tag>
  )
}
