import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'header';
}

/**
 * Fade + rise into view once, when scrolled near. Honours reduced-motion via
 * framer-motion's built-in MotionConfig handling at the app root.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      {children}
    </MotionTag>
  );
}
