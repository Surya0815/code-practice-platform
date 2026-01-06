import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Zap, Flame, Skull, Rocket, ArrowLeft, Award } from 'lucide-react';
import type { Language, Level } from '../App';

interface LevelSelectionProps {
  language: Language;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
  progress: { [key: string]: boolean[] };
  onShowCertificate?: () => void;
}

export function LevelSelection({ language, onSelectLevel, onBack, progress, onShowCertificate }: LevelSelectionProps) {
  const getLevelProgress = (level: Level): number => {
    const levelProgress = progress[level];
    if (!levelProgress) return 0;
    const completed = levelProgress.filter(p => p).length;
    return Math.round((completed / 20) * 100);
  };
  const levels: Array<{
    name: Level;
    displayName: string;
    icon: any;
    color: string;
    gradient: string;
    problems: number;
    description: string;
  }> = [
    {
      name: 'easy',
      displayName: 'Easy',
      icon: Zap,
      color: 'text-green-400',
      gradient: 'from-green-500 to-emerald-700',
      problems: 20,
      description: 'Perfect for beginners',
    },
    {
      name: 'medium',
      displayName: 'Medium',
      icon: Flame,
      color: 'text-yellow-400',
      gradient: 'from-yellow-500 to-orange-700',
      problems: 20,
      description: 'Intermediate challenges',
    },
    {
      name: 'hard',
      displayName: 'Hard',
      icon: Skull,
      color: 'text-red-400',
      gradient: 'from-red-500 to-red-800',
      problems: 20,
      description: 'Advanced problems',
    },
    {
      name: 'extreme',
      displayName: 'Extreme',
      icon: Rocket,
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-pink-700',
      problems: 20,
      description: 'Expert level only',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Languages
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4 px-6 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
            <span className="text-purple-300">{language}</span>
          </div>
          <h1 className="text-white mb-4">Choose Your Difficulty Level</h1>
          <p className="text-purple-300 text-xl">Select the challenge that matches your skill</p>
        </motion.div>

        {onShowCertificate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-yellow-900/30 to-purple-900/30 border-yellow-500/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Award className="w-12 h-12 text-yellow-400" />
                  <div>
                    <h3 className="text-white text-xl mb-1">🎉 Course Completed!</h3>
                    <p className="text-yellow-300">You've successfully completed all {language} challenges!</p>
                  </div>
                </div>
                <Button
                  onClick={onShowCertificate}
                  className="bg-yellow-600 hover:bg-yellow-700 text-lg px-6 py-6"
                >
                  <Award className="w-5 h-5 mr-2" />
                  View Certificate
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => onSelectLevel(level.name)}
                  className="cursor-pointer overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-slate-800/50 border-purple-500/30 hover:border-purple-400 h-full"
                >
                  <div className={`h-3 bg-gradient-to-r ${level.gradient}`}></div>
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h2 className="text-white mb-2">{level.displayName}</h2>
                        <p className="text-purple-300 mb-4">{level.description}</p>
                      </div>
                      <div className={`p-4 rounded-full bg-gradient-to-br ${level.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-purple-300">
                        <span>Progress:</span>
                        <div className="flex items-center gap-2">
                          <span className={level.color}>{getLevelProgress(level.name)}%</span>
                          {getLevelProgress(level.name) === 100 && (
                            <Badge className="bg-green-600 text-xs">✓</Badge>
                          )}
                        </div>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getLevelProgress(level.name)}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className={`h-full bg-gradient-to-r ${level.gradient}`}
                        ></motion.div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-purple-400">Click to start coding</span>
                      <span className={`${level.color} group-hover:translate-x-2 transition-transform`}>
                        →
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-slate-800/30 rounded-lg p-6 border border-purple-500/20"
        >
          <h3 className="text-white mb-3">What You'll Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-purple-300 text-sm">
            <div>✓ Real-time error detection</div>
            <div>✓ Time tracking</div>
            <div>✓ Backspace counter</div>
            <div>✓ Performance analytics</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
