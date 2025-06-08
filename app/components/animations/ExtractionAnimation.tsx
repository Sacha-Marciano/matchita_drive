import { motion } from "framer-motion";

export default function ExtractionAnimation() {
  const lineVariants = {
    initial: () => ({
      opacity: 0,
      y: 10,
      x: 0,
      scale: 1,
    }),
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      y: [-10, -30 - i * 10],
      x: [0, i % 2 === 0 ? -5 : 5],
      scale: [1, 1.05, 1],
      transition: {
        delay: i * 0.4,
        duration: 1.6,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Central document box */}
      <div className="w-16 h-20 bg-paul-500 rounded-sm shadow-md z-0" />

      {/* Text lines animating out */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-10 h-1 rounded-sm bg-paul-300 z-10"
          style={{
            bottom: "50%",
            left: "50%",
            transform: "translate(-50%, 50%)",
          }}
          custom={i}
          variants={lineVariants}
          initial="initial"
          animate="animate"
        />
      ))}
    </div>
  );
}
