"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF∑∫∂∇≈≠∞";

export function MatrixRain({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * fontSize;

        // Leading character is brighter
        ctx.fillStyle = "#aaffcc";
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillText(char, i * fontSize, y);

        // Trail
        ctx.fillStyle = "#00ff41";
        ctx.font = `${fontSize}px monospace`;
        if (drops[i] > 1) {
          const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillText(trailChar, i * fontSize, (drops[i] - 1) * fontSize);
        }

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", resize);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] cursor-pointer bg-black"
      onClick={onClose}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Red pill / blue pill hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="font-mono text-sm text-green-400/70 mb-3">
          Wake up, developer. The Matrix has you.
        </p>
        <p className="font-mono text-xs text-green-400/40">
          Press any key or click to exit
        </p>
      </motion.div>
    </motion.div>
  );
}
