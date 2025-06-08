import { motion } from "framer-motion";
import { Check } from "lucide-react"; // optional check icon

export default function SaveAnimation() {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Pulse Ring */}
      <motion.div
        className="absolute w-20 h-20 rounded-full border-2 border-paul-300"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.4],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeOut",
        }}
      />

      {/* Document box with subtle glow & pop */}
      <motion.div
        className="w-16 h-20 bg-paul-500 rounded-sm shadow-md z-10"
        initial={{ scale: 1, boxShadow: "0 0 0px #00000000" }}
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 0px #00000000",
            "0 0 12px #facc15",
            "0 0 0px #00000000",
          ],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      {/* Optional checkmark to reinforce "saved" */}
      <motion.div
        className="absolute z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <Check className="text-paul-300 w-6 h-6" />
      </motion.div>
    </div>
  );
}
