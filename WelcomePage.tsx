import { Button } from './ui/button';
import { Code2, Sparkles, Terminal, Zap, Cpu, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomePageProps {
  onStart: () => void;
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-purple-400/20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Code2 className="w-24 h-24" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-pink-400/20"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Terminal className="w-32 h-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-indigo-400/20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Cpu className="w-28 h-28" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-1/3 text-purple-300/20"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Zap className="w-20 h-20" />
        </motion.div>
      </div>

      <div className="text-center z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </motion.div>
            <h1 className="text-white text-6xl md:text-8xl">
              Welcome
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </motion.div>
          </div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white text-3xl md:text-5xl mb-4"
          >
            to the
          </motion.h2>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 blur-2xl opacity-50 animate-pulse"></div>
            <h1 className="relative text-white text-5xl md:text-7xl bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent px-8 py-4">
              Online Coding Platform
            </h1>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-purple-200 text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
        >
          Master programming languages, solve challenges, and track your progress in real-time
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <Button
            onClick={onStart}
            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-8 text-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group"
          >
            <Rocket className="w-8 h-8 mr-3 group-hover:translate-x-1 transition-transform" />
            Click Here to Start
            <motion.span
              className="ml-3"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-purple-300 text-sm"
          >
            ↓ Begin your coding journey ↓
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-white/80"
        >
          {[
            { icon: Code2, text: '12 Languages' },
            { icon: Terminal, text: '960 Problems' },
            { icon: Zap, text: 'Real-time Analytics' },
            { icon: Cpu, text: 'Error Detection' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <item.icon className="w-8 h-8 text-purple-300" />
              <span className="text-sm">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
