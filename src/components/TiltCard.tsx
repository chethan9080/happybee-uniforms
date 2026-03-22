import React, { useRef, useState, MouseEvent } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

export function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const [shineOpacity, setShineOpacity] = useState(0);
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["-30%", "30%"]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["-30%", "30%"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Disable on mobile purely logically

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    x.set(clickX / width - 0.5);
    y.set(clickY / height - 0.5);
    setShineOpacity(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setShineOpacity(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative perspective-[1000px] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] mix-blend-overlay overflow-hidden"
        style={{
          opacity: shineOpacity,
          background: "radial-gradient(circle 300px at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)",
          x: shineX,
          y: shineY
        }}
      />
      {children}
    </motion.div>
  );
}
