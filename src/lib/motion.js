export const easeOut = [0.16, 1, 0.3, 1];

export const fadeSwap = {
  initial: { opacity: 0, y: 10, filter: "blur(3px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(3px)" },
  transition: { duration: 0.55, ease: easeOut },
};

export const springPrecise = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.72,
};

export const springSoft = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

export const staggerHero = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

export const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

export const heroName = {
  hidden: { opacity: 0, y: 18, clipPath: "inset(0 28% 0 0)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.95, ease: easeOut },
  },
};
