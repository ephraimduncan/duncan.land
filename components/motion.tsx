import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
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

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div variants={container} initial="hidden" animate="show" className={className}>
        {children}
      </m.div>
    </LazyMotion>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return <m.div variants={item}>{children}</m.div>;
}

export { Container, Item };
