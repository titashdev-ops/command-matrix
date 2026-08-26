export const easeOut = [0.16, 1, 0.3, 1];

export const fadeSwap = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)" },
  transition: { duration: 0.48, ease: easeOut },
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
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const heroItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};
