export const easeOut = [0.16, 1, 0.3, 1];
export const easeLux = [0.22, 1, 0.36, 1];

export const springBounce = {
  type: "spring",
  stiffness: 380,
  damping: 22,
  mass: 0.72,
};

export const springPrecise = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.65,
};

export const springSoft = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.9,
};

export const fadeSwap = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
  transition: springSoft,
};

export const modalReveal = {
  initial: { opacity: 0, y: 26, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 12, scale: 0.985 },
  transition: springBounce,
};

export const staggerHero = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springSoft },
};

export const heroName = {
  hidden: { opacity: 0, y: 18, clipPath: "inset(0 28% 0 0)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.95, ease: easeLux },
  },
};

export const coverReveal = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springBounce,
  },
};
