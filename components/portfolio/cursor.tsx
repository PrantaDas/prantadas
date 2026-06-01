"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const TRAIL_COUNT = 4;

// Each trail dot uses a progressively slower spring — they naturally lag behind
const trailConfigs = [
  { damping: 32, stiffness: 220, mass: 0.7,  size: 5, opacity: 0.35 },
  { damping: 40, stiffness: 160, mass: 1.0,  size: 4, opacity: 0.22 },
  { damping: 50, stiffness: 110, mass: 1.4,  size: 3, opacity: 0.13 },
  { damping: 60, stiffness:  70, mass: 1.8,  size: 2, opacity: 0.07 },
];

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Main outer ring — medium spring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Inner dot — tight spring (almost instant)
  const dotSpring = { damping: 50, stiffness: 800, mass: 0.1 };
  const dotX = useSpring(mouseX, dotSpring);
  const dotY = useSpring(mouseY, dotSpring);

  // Trail dots — each progressively slower
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const trailSprings = trailConfigs.map((cfg) => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    x: useSpring(mouseX, { damping: cfg.damping, stiffness: cfg.stiffness, mass: cfg.mass }),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    y: useSpring(mouseY, { damping: cfg.damping, stiffness: cfg.stiffness, mass: cfg.mass }),
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    const interactables = document.querySelectorAll(
      "a, button, [data-cursor-hover], input, textarea, select",
    );
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, [mouseX, mouseY, isVisible]);

  // Only show on non-touch devices
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return null;
  }

  return (
    <>
      {/* Trail dots — rendered behind the main cursor */}
      {trailConfigs.map((cfg, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full mix-blend-difference bg-white"
          style={{
            x: trailSprings[i].x,
            y: trailSprings[i].y,
            translateX: "-50%",
            translateY: "-50%",
            width: cfg.size,
            height: cfg.size,
          }}
          animate={{ opacity: isVisible ? cfg.opacity : 0 }}
          transition={{ duration: 0.15 }}
        />
      ))}

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.8 : isClicking ? 0.8 : 1,
          width: isHovering ? 40 : 32,
          height: isHovering ? 40 : 32,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className="w-full h-full rounded-full border border-white/80"
          style={{ borderWidth: "1.5px" }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.5 : 1,
          width: isHovering ? 6 : 5,
          height: isHovering ? 6 : 5,
        }}
        transition={{ duration: 0.1 }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </motion.div>
    </>
  );
}
