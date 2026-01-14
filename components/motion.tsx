"use client";

import { motion, useReducedMotion } from "motion/react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const containerReduced = {
  hidden: {},
  show: {},
};

const item = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 19,
      mass: 1.2,
    },
  },
};

const itemReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div 
      variants={shouldReduceMotion ? containerReduced : container} 
      initial="hidden" 
      animate="show" 
      {...(className ? { className } : {})}
    >
      {children}
    </motion.div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  
  return <motion.div variants={shouldReduceMotion ? itemReduced : item}>{children}</motion.div>;
}

export { Container, Item };
