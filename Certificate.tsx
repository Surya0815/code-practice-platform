import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Award, Download, X, Star, Trophy } from 'lucide-react';
import type { Language } from '../App';

interface CertificateProps {
  language: Language;
  onClose: () => void;
}

export function Certificate({ language, onClose }: CertificateProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('Certificate download functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Star className="w-6 h-6" />
          </motion.div>
        ))}
      </div>

      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute top-4 right-4 text-white hover:text-purple-300 z-20"
        size="icon"
      >
        <X className="w-6 h-6" />
      </Button>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative z-10 max-w-4xl w-full"
      >
        {/* Certificate Container */}
        <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-lg shadow-2xl p-12 border-8 border-double border-purple-400 relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-purple-600 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-purple-600 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-purple-600 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-purple-600 rounded-br-lg"></div>

          {/* Certificate Content */}
          <div className="text-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mb-6"
            >
              <div className="inline-block relative">
                <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Award className="w-12 h-12 text-purple-600" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-purple-900 mb-4"
            >
              Certificate of Achievement
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <p className="text-gray-700 text-xl mb-2">This is to certify that</p>
              <div className="my-6 py-4 border-b-2 border-t-2 border-purple-300">
                <p className="text-purple-800 text-3xl">Coding Champion</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mb-8"
            >
              <p className="text-gray-700 text-lg mb-4">has successfully completed the</p>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-lg inline-block shadow-lg mb-4">
                <p className="text-3xl">{language} Programming Course</p>
              </div>
              <p className="text-gray-700 text-lg">
                by solving all 80 programming challenges across all difficulty levels
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="grid grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto"
            >
              {['Easy', 'Medium', 'Hard', 'Extreme'].map((level, index) => (
                <div key={level} className="bg-white rounded-lg p-3 shadow border border-purple-200">
                  <div className="text-green-600 mb-1">✓</div>
                  <p className="text-sm text-gray-700">{level}</p>
                  <p className="text-xs text-gray-500">20/20</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex justify-between items-end pt-8 border-t border-purple-300"
            >
              <div className="text-left">
                <p className="text-gray-600 text-sm mb-1">Date of Completion</p>
                <p className="text-purple-900">{currentDate}</p>
              </div>
              <div className="text-right">
                <div className="w-48 border-t-2 border-purple-900 mb-2"></div>
                <p className="text-gray-600 text-sm">Authorized Signature</p>
                <p className="text-purple-900 italic">Online Coding Platform</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="flex gap-4 justify-center mt-8"
        >
          <Button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white hover:bg-purple-50 text-purple-900 px-8 py-6 text-lg border-2 border-purple-400"
          >
            Continue Learning
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
