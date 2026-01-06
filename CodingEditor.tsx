import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, Play, Clock, Delete, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Eye, Award } from 'lucide-react';
import { motion } from 'motion/react';
import type { Language, Level } from '../App';
import { problemsData } from './ProgramsData';

interface CodingEditorProps {
  language: Language;
  level: Level;
  programIndex: number;
  onBack: () => void;
  onNextProgram: () => void;
  onPreviousProgram: () => void;
  onProgramComplete: (language: Language, level: Level, programIndex: number) => void;
  isProgramCompleted: boolean;
  isLanguageComplete: boolean;
  onShowCertificate: () => void;
}

export function CodingEditor({ 
  language, 
  level, 
  programIndex,
  onBack,
  onNextProgram,
  onPreviousProgram,
  onProgramComplete,
  isProgramCompleted,
  isLanguageComplete,
  onShowCertificate
}: CodingEditorProps) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<Array<{ line: number; message: string; type: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showOutputDialog, setShowOutputDialog] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentProblem = problemsData[language]?.[level]?.[programIndex];

  useEffect(() => {
    // Reset everything when problem changes
    setCode('');
    setOutput('');
    setErrors([]);
    setIsSuccess(false);
    setTimeElapsed(0);
    setBackspaceCount(0);
    setCompletionPercentage(0);
    setStartTime(null);
    setShowSuccessDialog(false);
    setShowOutputDialog(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [language, level, programIndex]);

  useEffect(() => {
    if (startTime && !isSuccess) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, isSuccess]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    setCode(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      setBackspaceCount(prev => prev + 1);
    }
  };

  // Prevent copy-paste
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    alert('Copy-paste is not allowed in this coding platform. Please write your code manually.');
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    alert('Copy operation is disabled in this coding platform.');
  };

  const handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    alert('Cut operation is disabled in this coding platform.');
  };

  const analyzeCode = (code: string): Array<{ line: number; message: string; type: string }> => {
    const errors: Array<{ line: number; message: string; type: string }> = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // Syntax errors - common misspellings
      if (line.includes('printt') || line.includes('printff')) {
        errors.push({ 
          line: index + 1, 
          message: 'Function name misspelled', 
          type: 'SyntaxError' 
        });
      }

      // Python-specific checks
      if (language === 'Python') {
        if (line.trim().startsWith('print') && !line.includes('(')) {
          errors.push({
            line: index + 1,
            message: 'Python 3 requires parentheses for print()',
            type: 'SyntaxError'
          });
        }
      }

      // MySQL-specific checks
      if (language === 'MySQL') {
        if (line.trim().toUpperCase().startsWith('SELECT') && !line.includes(';') && line.trim().length > 0) {
          errors.push({
            line: index + 1,
            message: 'SQL statements should end with semicolon',
            type: 'SyntaxError'
          });
        }
      }

      // CSS-specific checks
      if (language === 'CSS') {
        if (line.includes(':') && !line.includes(';') && !line.includes('{') && line.trim().length > 0) {
          errors.push({
            line: index + 1,
            message: 'CSS properties should end with semicolon',
            type: 'SyntaxError'
          });
        }
      }
      
      // Missing semicolons (for C, C++, Java, etc.)
      if (['C', 'C+', 'C++', 'Java', 'JavaScript', 'PHP'].includes(language)) {
        if (line.trim() && 
            !line.trim().endsWith(';') && 
            !line.trim().endsWith('{') && 
            !line.trim().endsWith('}') &&
            !line.trim().startsWith('//') &&
            !line.trim().startsWith('#') &&
            !line.trim().startsWith('if') &&
            !line.trim().startsWith('for') &&
            !line.trim().startsWith('while') &&
            !line.includes('(') && 
            line.trim().length > 0) {
          errors.push({ 
            line: index + 1, 
            message: 'Missing semicolon at end of statement', 
            type: 'SyntaxError' 
          });
        }
      }

      // Bracket matching
      const openBrackets = (line.match(/\{/g) || []).length;
      const closeBrackets = (line.match(/\}/g) || []).length;
      if (openBrackets !== closeBrackets && line.trim()) {
        errors.push({ 
          line: index + 1, 
          message: 'Unmatched brackets', 
          type: 'SyntaxError' 
        });
      }

      // Undefined variables (simple check)
      if (line.includes('console.log') && language === 'JavaScript') {
        const match = line.match(/console\.log\((\w+)\)/);
        if (match && !code.includes(`let ${match[1]}`) && !code.includes(`var ${match[1]}`) && !code.includes(`const ${match[1]}`)) {
          errors.push({ 
            line: index + 1, 
            message: `Variable '${match[1]}' may not be defined`, 
            type: 'ReferenceError' 
          });
        }
      }
    });

    return errors;
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    setErrors([]);
    setIsSuccess(false);

    setTimeout(() => {
      const detectedErrors = analyzeCode(code);
      
      if (detectedErrors.length > 0) {
        setErrors(detectedErrors);
        setOutput('❌ Compilation/Runtime errors detected. Please fix them before running.');
        setIsSuccess(false);
      } else {
        // Simulate successful execution
        const simulatedOutput = currentProblem?.expectedOutput || 'Program executed successfully!';
        setOutput(`✅ ${simulatedOutput}`);
        setIsSuccess(true);
        
        // Calculate completion percentage
        const codeQuality = Math.max(0, 100 - (backspaceCount * 2));
        const timeBonus = Math.max(0, 100 - (timeElapsed / 10));
        const percentage = Math.min(100, Math.round((codeQuality + timeBonus) / 2));
        setCompletionPercentage(percentage);

        // Mark program as complete
        if (!isProgramCompleted) {
          onProgramComplete(language, level, programIndex);
        }

        // Show success dialog
        setShowSuccessDialog(true);
      }
      
      setIsRunning(false);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = () => {
    switch (level) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      case 'extreme': return 'bg-purple-500';
    }
  };

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Problem data not available</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:text-purple-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-white border-purple-400">
              {language}
            </Badge>
            <Badge className={getLevelColor()}>
              {level.toUpperCase()}
            </Badge>
            <Badge variant="secondary">
              Problem {programIndex + 1}/20
            </Badge>
            {isProgramCompleted && (
              <Badge className="bg-green-600">
                ✓ Completed
              </Badge>
            )}
          </div>
        </div>

        {isLanguageComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-yellow-900/30 to-purple-900/30 border-yellow-500/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-white">Congratulations! You've completed all {language} challenges!</p>
                    <p className="text-yellow-300 text-sm">View your certificate</p>
                  </div>
                </div>
                <Button
                  onClick={onShowCertificate}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  View Certificate
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Description */}
          <Card className="lg:col-span-1 bg-slate-800 border-purple-500/30 p-6">
            <h2 className="text-white mb-4">Problem Statement</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-purple-300 mb-2">Title</h3>
                <p className="text-white">{currentProblem.title}</p>
              </div>
              
              <div>
                <h3 className="text-purple-300 mb-2">Description</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentProblem.description}
                </p>
              </div>

              <div>
                <h3 className="text-purple-300 mb-2">Expected Output</h3>
                <div className="bg-slate-900 p-3 rounded text-green-400 text-sm font-mono">
                  {currentProblem.expectedOutput}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={onPreviousProgram}
                  disabled={programIndex === 0}
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onNextProgram}
                  disabled={programIndex === 19}
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Code Editor and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-purple-500/30 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="text-white">{formatTime(timeElapsed)}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800 border-purple-500/30 p-4">
                <div className="flex items-center gap-3">
                  <Delete className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Backspaces</p>
                    <p className="text-white">{backspaceCount}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800 border-purple-500/30 p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Errors</p>
                    <p className="text-white">{errors.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Code Editor */}
            <Card className="bg-slate-800 border-purple-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">Code Editor</h3>
                <Button
                  onClick={runCode}
                  disabled={isRunning || !code.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
              </div>

              <div className="mb-2 text-yellow-400 text-xs">
                ⚠️ Copy-paste is disabled. Type your code manually.
              </div>

              <Textarea
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onCopy={handleCopy}
                onCut={handleCut}
                placeholder="Write your code here..."
                className="font-mono text-sm min-h-[300px] bg-slate-900 text-white border-purple-500/30"
              />
            </Card>

            {/* Errors Display */}
            {errors.length > 0 && (
              <Card className="bg-red-900/20 border-red-500/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <h3 className="text-red-400">
                    {errors.length} Error{errors.length !== 1 ? 's' : ''} Detected
                  </h3>
                </div>
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="bg-slate-900/50 p-3 rounded">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive" className="text-xs">
                          Line {error.line}
                        </Badge>
                        <div>
                          <p className="text-red-300 text-sm">{error.type}</p>
                          <p className="text-gray-300 text-sm">{error.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-gradient-to-br from-green-900 to-blue-900 border-green-500">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              You've Successfully Written the Program!
            </DialogTitle>
            <DialogDescription className="text-gray-200 text-lg pt-4">
              Congratulations! Your code executed without errors.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Completion Score</span>
                <span className="text-white">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-900/50 p-4 rounded-lg">
              <div>
                <p className="text-gray-400">Time Taken</p>
                <p className="text-white">{formatTime(timeElapsed)}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Backspaces</p>
                <p className="text-white">{backspaceCount}</p>
              </div>
            </div>

            <Button
              onClick={() => setShowOutputDialog(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
            >
              <Eye className="w-5 h-5 mr-2" />
              Click Here to See Your Output
            </Button>

            {programIndex < 19 && (
              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  onNextProgram();
                }}
                variant="outline"
                className="w-full text-white border-white hover:bg-white/10"
              >
                Next Problem
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Output Dialog */}
      <Dialog open={showOutputDialog} onOpenChange={setShowOutputDialog}>
        <DialogContent className="bg-slate-900 border-purple-500">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-400" />
              Output Here
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="bg-slate-800 p-6 rounded-lg border-2 border-green-500/50">
              <h3 className="text-green-400 mb-3">Program Output:</h3>
              <div className="bg-black p-4 rounded font-mono text-green-400">
                {output}
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-purple-300 mb-2">Expected Output:</h3>
              <div className="bg-black p-3 rounded font-mono text-sm text-gray-400">
                {currentProblem.expectedOutput}
              </div>
            </div>

            <Button
              onClick={() => setShowOutputDialog(false)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
