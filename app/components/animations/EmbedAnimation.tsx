import { motion } from "framer-motion";
import { useMemo } from "react";

const letters = ["A", "b", "X", "g", "T", "m"];
const numbers = ["0", "1", "7", "3", "8", "5"];
const NUM_ROWS = 5;

export default function VectorizationAnimation() {
  const floatingItems = useMemo(() => {
    return Array.from({ length: NUM_ROWS }, (_, rowIdx) =>
      letters.map((char, i) => ({
        id: `${rowIdx}-${i}`,
        start: char,
        end: numbers[i],
        left: `${20 + i * 10}%`,
        delay: i * 0.3,
        top: `${20 + rowIdx * 10}%`, // Stack vertically
      }))
    ).flat();
  }, []);

  return (
    <div className="relative w-40 h-40 flex items-center justify-center overflow-hidden">
      {/* Document box */}
      <div className="w-16 h-20 bg-matchita-500 rounded-sm shadow-md z-0" />

      {/* Floating transforming characters */}
      {floatingItems.map(({ id, start, end, left, delay, top }) => (
        <motion.div
          key={id}
          className="absolute text-matchita-600 font-bold text-sm"
          style={{ left, top }}
          animate={{ y: ["0%", "-60%"], opacity: [1, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <motion.span
            key={`${id}-start`}
            animate={{ opacity: [1, 0], y: [0, -10] }}
            transition={{ duration: 1, repeat: Infinity, delay }}
            className="absolute"
          >
            {start}
          </motion.span>
          <motion.span
            key={`${id}-end`}
            animate={{ opacity: [0, 1], y: [10, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: delay + 1 }}
            className="absolute"
          >
            {end}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
