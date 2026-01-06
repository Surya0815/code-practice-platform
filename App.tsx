import { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { LanguageSelection } from './components/LanguageSelection';
import { LevelSelection } from './components/LevelSelection';
import { CodingEditor } from './components/CodingEditor';
import { Certificate } from './components/Certificate';

export type Language = 'C' | 'C+' | 'C++' | 'Java' | 'JavaScript' | 'HTML' | 'PHP' | 'Data Structure' | 'ML' | 'MySQL' | 'Python' | 'CSS';
export type Level = 'easy' | 'medium' | 'hard' | 'extreme';

export interface ProgramData {
  id: number;
  title: string;
  description: string;
  expectedOutput: string;
  testCases: Array<{ input: string; output: string }>;
}

export interface ProgressData {
  [language: string]: {
    [level: string]: boolean[]; // Array of 20 booleans for each program
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'welcome' | 'language' | 'level' | 'editor' | 'certificate'>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedProgramIndex, setSelectedProgramIndex] = useState<number>(0);
  const [progress, setProgress] = useState<ProgressData>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('codingPlatformProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem('codingPlatformProgress', JSON.stringify(progress));
    }
  }, [progress]);

  const handleStart = () => {
    setCurrentPage('language');
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentPage('level');
  };

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setSelectedProgramIndex(0);
    setCurrentPage('editor');
  };

  const handleBackToLanguages = () => {
    setCurrentPage('language');
    setSelectedLanguage(null);
    setSelectedLevel(null);
  };

  const handleBackToLevels = () => {
    setCurrentPage('level');
    setSelectedLevel(null);
  };

  const handleNextProgram = () => {
    if (selectedProgramIndex < 19) {
      setSelectedProgramIndex(selectedProgramIndex + 1);
    }
  };

  const handlePreviousProgram = () => {
    if (selectedProgramIndex > 0) {
      setSelectedProgramIndex(selectedProgramIndex - 1);
    }
  };

  const markProgramComplete = (language: Language, level: Level, programIndex: number) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      if (!newProgress[language]) {
        newProgress[language] = {};
      }
      if (!newProgress[language][level]) {
        newProgress[language][level] = Array(20).fill(false);
      }
      newProgress[language][level][programIndex] = true;
      return newProgress;
    });
  };

  const checkLanguageComplete = (language: Language): boolean => {
    const levels: Level[] = ['easy', 'medium', 'hard', 'extreme'];
    if (!progress[language]) return false;
    
    return levels.every(level => {
      const levelProgress = progress[language]?.[level];
      return levelProgress && levelProgress.every(completed => completed === true);
    });
  };

  const handleShowCertificate = () => {
    setCurrentPage('certificate');
  };

  const handleCertificateClose = () => {
    setCurrentPage('language');
    setSelectedLanguage(null);
    setSelectedLevel(null);
  };

  const getProgramProgress = (language: Language, level: Level, programIndex: number): boolean => {
    return progress[language]?.[level]?.[programIndex] || false;
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'welcome' && <WelcomePage onStart={handleStart} />}
      
      {currentPage === 'language' && (
        <LanguageSelection 
          onSelectLanguage={handleLanguageSelect}
          progress={progress}
        />
      )}
      
      {currentPage === 'level' && selectedLanguage && (
        <LevelSelection 
          language={selectedLanguage}
          onSelectLevel={handleLevelSelect}
          onBack={handleBackToLanguages}
          progress={progress[selectedLanguage] || {}}
          onShowCertificate={checkLanguageComplete(selectedLanguage) ? handleShowCertificate : undefined}
        />
      )}
      
      {currentPage === 'editor' && selectedLanguage && selectedLevel && (
        <CodingEditor
          language={selectedLanguage}
          level={selectedLevel}
          programIndex={selectedProgramIndex}
          onBack={handleBackToLevels}
          onNextProgram={handleNextProgram}
          onPreviousProgram={handlePreviousProgram}
          onProgramComplete={markProgramComplete}
          isProgramCompleted={getProgramProgress(selectedLanguage, selectedLevel, selectedProgramIndex)}
          isLanguageComplete={checkLanguageComplete(selectedLanguage)}
          onShowCertificate={handleShowCertificate}
        />
      )}

      {currentPage === 'certificate' && selectedLanguage && (
        <Certificate
          language={selectedLanguage}
          onClose={handleCertificateClose}
        />
      )}
    </div>
  );
}
