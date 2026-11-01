import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GameId, QuizQuestion } from '../types';
import { QUIZ_QUESTION_BANKS } from '../data/quizQuestions';
import { GAMES } from '../data/games';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft, Trophy, Sparkles } from 'lucide-react';

interface QuizModalProps {
  gameId: GameId;
  isOpen: boolean;
  onClose: () => void;
}

interface ShuffledQuestion {
  id: string;
  question: string;
  shuffledOptions: string[];
  correctShuffledIndex: number;
  explanation: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({ gameId, isOpen, onClose }) => {
  const game = useMemo(() => GAMES.find(g => g.id === gameId), [gameId]);
  const questionBank = useMemo(() => QUIZ_QUESTION_BANKS[gameId] || [], [gameId]);

  const [sessionQuestions, setSessionQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize a new 5-question session with shuffled questions and shuffled options
  const startNewQuizSession = useCallback(() => {
    if (!questionBank || questionBank.length === 0) return;

    // Shuffle the full bank and take exactly 5 questions
    const shuffledBank = [...questionBank].sort(() => Math.random() - 0.5);
    const selectedFive = shuffledBank.slice(0, 5);

    // For each question, shuffle its 4 options while keeping correct index in sync
    const preparedQuestions: ShuffledQuestion[] = selectedFive.map((q: QuizQuestion) => {
      const originalOptionsWithIndices = q.options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === q.correctIndex
      }));

      // Shuffle options array
      const shuffled = [...originalOptionsWithIndices].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffled.findIndex(item => item.isCorrect);

      return {
        id: q.id,
        question: q.question,
        shuffledOptions: shuffled.map(s => s.text),
        correctShuffledIndex: newCorrectIndex,
        explanation: q.explanation
      };
    });

    setSessionQuestions(preparedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsCompleted(false);
  }, [questionBank]);

  useEffect(() => {
    if (isOpen) {
      startNewQuizSession();
    }
  }, [isOpen, startNewQuizSession]);

  if (!isOpen) return null;

  const currentQ = sessionQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !currentQ) return; // Prevent changing answer once selected
    setSelectedOption(idx);
    if (idx === currentQ.correctShuffledIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
    }
  };

  const getScoreRating = (s: number) => {
    if (s === 5) return { title: 'Junior Chief Scientist!', message: 'Perfect 5 out of 5! Exceptional scientific expertise.' };
    if (s >= 4) return { title: 'Senior Lab Explorer!', message: 'Great job! You really know your science.' };
    if (s >= 3) return { title: 'Budding Investigator!', message: 'Good effort! You grasp the key core principles.' };
    return { title: 'Curious Apprentice!', message: 'Keep experimenting and exploring to expand your knowledge.' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] transition-all transform-gpu"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base leading-tight">
                {game?.title} Science Quiz
              </h3>
              <p className="text-xs text-slate-500">
                {!isCompleted ? `Question ${currentIndex + 1} of 5` : 'Quiz Complete'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
            title="Return to experiment"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Game</span>
          </button>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
              style={{ width: `${((currentIndex + (selectedOption !== null ? 1 : 0)) / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isCompleted && currentQ ? (
            <div className="space-y-5">
              {/* Question Text */}
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h4>

              {/* 4 Answer Choices */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.shuffledOptions.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctShuffledIndex;
                  const hasAnswered = selectedOption !== null;

                  let buttonStyle = "border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 bg-white text-slate-800";
                  let indicatorStyle = "border-slate-300 text-slate-600 bg-slate-50";

                  if (hasAnswered) {
                    if (isCorrect) {
                      buttonStyle = "border-emerald-400 bg-emerald-50 text-emerald-950 font-medium shadow-sm ring-1 ring-emerald-400";
                      indicatorStyle = "border-emerald-500 bg-emerald-500 text-white";
                    } else if (isSelected) {
                      buttonStyle = "border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400";
                      indicatorStyle = "border-rose-500 bg-rose-500 text-white";
                    } else {
                      buttonStyle = "border-slate-100 bg-slate-50/50 text-slate-400 opacity-60";
                      indicatorStyle = "border-slate-200 text-slate-300";
                    }
                  }

                  const choiceLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-sm sm:text-base cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${indicatorStyle}`}>
                          {choiceLetters[idx]}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 animate-in zoom-in" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 animate-in zoom-in" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation */}
              {selectedOption !== null && (
                <div className={`p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
                  selectedOption === currentQ.correctShuffledIndex
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {selectedOption === currentQ.correctShuffledIndex ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {selectedOption === currentQ.correctShuffledIndex ? 'Correct!' : 'Not quite!'}
                      </p>
                      <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completion Screen */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 p-1 shadow-lg flex items-center justify-center text-white">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900">
                  {getScoreRating(score).title}
                </h4>
                <p className="text-slate-600 text-sm mt-1">
                  {getScoreRating(score).message}
                </p>
              </div>

              {/* Score Display */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-sm font-semibold text-purple-700">Final Score:</span>
                <span className="text-3xl font-black text-purple-900 tabular-nums">{score}</span>
                <span className="text-lg font-bold text-purple-400">/ 5</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Game</span>
          </button>

          {!isCompleted ? (
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                selectedOption !== null
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
              }`}
            >
              <span>{currentIndex + 1 === 5 ? 'View Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={startNewQuizSession}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
