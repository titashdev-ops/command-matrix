export const easeOut = [0.16, 1, 0.3, 1];
export const easeLux = [0.22, 1, 0.36, 1];

export const fadeSwap = {
  initial: { opacity: 0, y: 18, scale: 0.988, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, scale: 0.994, filter: "blur(5px)" },
  transition: { duration: 0.64, ease: easeLux },
};

export const modalReveal = {
  initial: { opacity: 0, y: 22, scale: 0.97, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 12, scale: 0.985, filter: "blur(6px)" },
  transition: { duration: 0.56, ease: easeLux },
};

export const springPrecise = {
  type: "spring",
  stiffness: 300,
  damping: 36,
  mass: 0.78,
};

export const springSoft = {
  type: "spring",
  stiffness: 220,
  damping: 32,
  mass: 0.95,
};

export const staggerHero = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

export const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.88, ease: easeLux } },
};

export const heroName = {
  hidden: { opacity: 0, y: 20, clipPath: "inset(0 32% 0 0)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.05, ease: easeLux },
  },
};

export const coverReveal = {
  initial: { opacity: 0, y: 16, clipPath: "inset(6% 0 0 0)" },
  animate: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 0.78, ease: easeLux },
  },
};
