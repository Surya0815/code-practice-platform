import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Code2, Database, Brain, FileCode, CheckCircle } from 'lucide-react';
import type { Language, ProgressData } from '../App';

interface LanguageSelectionProps {
  onSelectLanguage: (language: Language) => void;
  progress: ProgressData;
}

export function LanguageSelection({ onSelectLanguage, progress }: LanguageSelectionProps) {
  const getLanguageProgress = (language: Language): number => {
    const levels = ['easy', 'medium', 'hard', 'extreme'];
    let totalCompleted = 0;
    let total = 80; // 20 problems * 4 levels

    levels.forEach(level => {
      const levelProgress = progress[language]?.[level];
      if (levelProgress) {
        totalCompleted += levelProgress.filter(completed => completed).length;
      }
    });

    return Math.round((totalCompleted / total) * 100);
  };

  const isLanguageComplete = (language: Language): boolean => {
    return getLanguageProgress(language) === 100;
  };
  const languages: Array<{ name: Language; icon: any; color: string; description: string }> = [
    { name: 'C', icon: Code2, color: 'from-blue-500 to-blue-700', description: 'System Programming' },
    { name: 'C+', icon: Code2, color: 'from-blue-600 to-blue-800', description: 'Extended C' },
    { name: 'C++', icon: Code2, color: 'from-indigo-500 to-indigo-700', description: 'Object-Oriented' },
    { name: 'Java', icon: FileCode, color: 'from-red-500 to-red-700', description: 'Enterprise Apps' },
    { name: 'JavaScript', icon: FileCode, color: 'from-yellow-500 to-yellow-700', description: 'Web Development' },
    { name: 'HTML', icon: FileCode, color: 'from-orange-500 to-orange-700', description: 'Web Structure' },
    { name: 'PHP', icon: FileCode, color: 'from-purple-500 to-purple-700', description: 'Server-Side' },
    { name: 'Python', icon: FileCode, color: 'from-cyan-500 to-cyan-700', description: 'Versatile Language' },
    { name: 'MySQL', icon: Database, color: 'from-teal-500 to-teal-700', description: 'Database Management' },
    { name: 'CSS', icon: FileCode, color: 'from-rose-500 to-rose-700', description: 'Web Styling' },
    { name: 'Data Structure', icon: Database, color: 'from-green-500 to-green-700', description: 'Algorithms & DS' },
    { name: 'ML', icon: Brain, color: 'from-pink-500 to-pink-700', description: 'Machine Learning' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-white mb-4">Select Programming Language</h1>
          <p className="text-purple-300 text-xl">Choose your language to start coding</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang, index) => {
            const Icon = lang.icon;
            return (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  onClick={() => onSelectLanguage(lang.name)}
                  className="cursor-pointer overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-slate-800/50 border-purple-500/30 hover:border-purple-400"
                >
                  <div className={`h-2 bg-gradient-to-r ${lang.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-4 rounded-lg bg-gradient-to-br ${lang.color} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white mb-1">{lang.name}</h3>
                          {isLanguageComplete(lang.name) && (
                            <Badge className="bg-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                        </div>
                        <p className="text-purple-300 text-sm">{lang.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-purple-400">
                      <span>{getLanguageProgress(lang.name)}% Complete</span>
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-8 text-purple-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>4 Difficulty Levels</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>20 Problems Each</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Real-time Feedback</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
