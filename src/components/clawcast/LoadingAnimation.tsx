import { motion } from "framer-motion";
import { Search, Database, Brain, FileCheck } from "lucide-react";

const steps = [
  { icon: Search, label: "Searching sources...", delay: 0 },
  { icon: Database, label: "Gathering evidence...", delay: 0.5 },
  { icon: Brain, label: "Synthesizing analysis...", delay: 1 },
  { icon: FileCheck, label: "Preparing results...", delay: 1.5 },
];

interface LoadingAnimationProps {
  currentStep?: number;
}

export function LoadingAnimation({ currentStep = 0 }: LoadingAnimationProps) {
  return (
    <div className="w-full max-w-md mx-auto py-12 space-y-8">
      {/* Main animation */}
      <div className="flex justify-center">
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Brain className="w-8 h-8 text-primary" />
          </motion.div>
        </motion.div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx <= currentStep;
          const isCurrent = idx === currentStep;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isActive ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: step.delay, duration: 0.3 }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isCurrent ? "bg-primary/10" : ""
              }`}
            >
              <div className={`p-2 rounded-full ${
                isActive ? "bg-primary/20" : "bg-muted/50"
              }`}>
                <Icon className={`h-4 w-4 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`} />
              </div>
              <span className={`text-sm ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step.label}
              </span>
              {isCurrent && (
                <motion.div
                  className="ml-auto flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
