import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ end, duration = 2 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration * 1000 / end));
      
      const timer = setInterval(() => {
        start += Math.ceil(end / (duration * 60)); // smooth chunking
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function Stats3DCounter() {
  const stats = [
    { label: "Schools Supplied", value: 500, suffix: "+" },
    { label: "Happy Students", value: 10000, suffix: "+" },
    { label: "Uniform Styles", value: 50, suffix: "+" }
  ];

  return (
    <section className="py-24 px-6 relative z-10 hidden md:block w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className="perspective-[1000px]"
          >
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              style={{ rotateX: 10, transformStyle: "preserve-3d" }}
              className="bg-white/80 backdrop-blur-md border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/10 to-[#6B4EFF]/10"></div>
              <h3 className="text-4xl lg:text-5xl font-black text-foreground mb-2 flex items-baseline justify-center relative z-10" style={{ transform: "translateZ(30px)" }}>
                <Counter end={stat.value} />
                <span className="text-primary">{stat.suffix}</span>
              </h3>
              <p className="text-muted-foreground text-lg font-medium relative z-10" style={{ transform: "translateZ(20px)" }}>
                {stat.label}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
