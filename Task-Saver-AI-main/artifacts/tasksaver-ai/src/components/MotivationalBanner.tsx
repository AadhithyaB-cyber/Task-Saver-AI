import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TIPS = [
  "Every task you finish is a promise kept to yourself.",
  "Focus on progress, not perfection.",
  "Small steps daily lead to massive results.",
  "Your future self will thank you for starting today.",
  "Clarity comes from action, not thought.",
  "Prioritize ruthlessly — not everything deserves your energy.",
  "Done is better than perfect.",
  "One task at a time. That's all it takes.",
  "The secret to getting ahead is getting started.",
  "You're closer than you think. Keep going.",
];

export function MotivationalBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-primary-foreground font-medium text-center text-sm md:text-base italic"
          data-testid="motivational-tip"
        >
          {TIPS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
