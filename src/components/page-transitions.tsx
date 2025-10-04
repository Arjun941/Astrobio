"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  duration: 0.4
};

// Staggered children animation
const containerVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  out: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const childVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -10
  }
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredPageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

// Individual item wrapper for staggered animations
export function StaggeredItem({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      variants={childVariants}
    >
      {children}
    </motion.div>
  );
}

// Hero section with special entrance animation
export function HeroTransition({ children, className = "" }: PageTransitionProps) {
  const heroVariants = {
    initial: {
      opacity: 0,
      y: 60,
      scale: 0.9
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      variants={heroVariants}
    >
      {children}
    </motion.div>
  );
}

// Floating entrance animation
export function FloatingTransition({ children, className = "" }: PageTransitionProps) {
  const floatingVariants = {
    initial: {
      opacity: 0,
      y: 100,
      rotate: -5
    },
    in: {
      opacity: 1,
      y: 0,
      rotate: 0
    }
  };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      variants={floatingVariants}
    >
      {children}
    </motion.div>
  );
}