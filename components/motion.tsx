import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
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
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      duration: 0.3,
      bounce: 0,
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
      <MotionConfig reducedMotion="user">
        <m.div variants={container} initial="hidden" animate="show" className={className}>
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return <m.div variants={item}>{children}</m.div>;
}

export { Container, Item };
