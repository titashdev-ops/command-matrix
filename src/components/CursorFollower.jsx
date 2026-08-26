import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const bloomX = useSpring(x, { stiffness: 22, damping: 20, mass: 1.25 });
  const bloomY = useSpring(y, { stiffness: 22, damping: 20, mass: 1.25 });
  const cursorX = useSpring(x, { stiffness: 240, damping: 28, mass: 0.45 });
  const cursorY = useSpring(y, { stiffness: 240, damping: 28, mass: 0.45 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
    if (!fine || reduce) return;

    const updateMousePosition = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const interactive = e.target.closest("button, a, [role='button']");
      setIsHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[6] h-[36rem] w-[36rem] rounded-full"
        style={{
          x: bloomX,
          y: bloomY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(0,240,255,0.14) 0%, rgba(0,255,135,0.06) 38%, transparent 68%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100000] mix-blend-screen text-cyan-electric"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{ scale: isHovering ? 1.55 : 1, opacity: isHovering ? 1 : 0.85 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative flex h-8 w-8 items-center justify-center"
        >
          <span className="absolute inset-0 rounded-full border border-cyan-electric/70 shadow-[0_0_18px_rgba(0,240,255,0.45)]" />
          <span className="h-1 w-1 rounded-full bg-cyan-electric shadow-[0_0_10px_rgba(0,240,255,0.9)]" />
        </motion.div>
      </motion.div>
    </>
  );
}
