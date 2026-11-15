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
    if (selectedOption !== null || !currentQ) return;
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
    if (s === 5) return { title: 'Junior Chief Scientist!', message: 'Amazing! You scored a perfect 5 out of 5!' };
    if (s >= 4) return { title: 'Great Job!', message: 'Awesome job! You really understand this topic.' };
    if (s >= 3) return { title: 'Good Effort!', message: 'Nice work! You learned lots of cool facts.' };
    return { title: 'Keep Exploring!', message: 'Check the Fun Facts area to practice and try again!' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-purple-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF5FF] border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-purple-950 text-base leading-tight">
                {game?.title} Quiz
              </h3>
              <p className="text-xs text-purple-700 font-semibold">
                {!isCompleted ? `Question ${currentIndex + 1} of 5` : 'Quiz Finished!'}
              </p>
            </div>
          </div>
          
          {/* Exactly one Back to Game button on top */}
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Game</span>
          </button>
        </div>

        {/* Progress bar */}
        {!isCompleted && (
          <div className="w-full bg-purple-100 h-2">
            <div 
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${((currentIndex + (selectedOption !== null ? 1 : 0)) / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isCompleted && currentQ ? (
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h4>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.shuffledOptions.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctShuffledIndex;
                  const hasAnswered = selectedOption !== null;

                  let style = "border-slate-200 hover:border-purple-300 hover:bg-[#FAF5FF] text-slate-800 bg-white";

                  if (hasAnswered) {
                    if (isCorrect) {
                      style = "border-emerald-400 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-400";
                    } else if (isSelected) {
                      style = "border-rose-300 bg-rose-50 text-rose-950 ring-1 ring-rose-300";
                    } else {
                      style = "border-slate-100 bg-slate-50 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer ${style}`}
                    >
                      <span>{option}</span>
                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation feedback */}
              {selectedOption !== null && (
                <div className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                  selectedOption === currentQ.correctShuffledIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <p className="font-bold">
                    {selectedOption === currentQ.correctShuffledIndex ? '🎉 Correct!' : '💡 Good Try!'}
                  </p>
                  <p className="mt-1 opacity-90 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F3E8FF] text-purple-700 flex items-center justify-center shadow-xs">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900">
                  {getScoreRating(score).title}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  {getScoreRating(score).message}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-xs font-bold text-purple-700">Your Score:</span>
                <span className="text-2xl font-black text-purple-900">{score}</span>
                <span className="text-sm font-bold text-purple-400">/ 5</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Exactly one Back to Game button */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200/70 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Game</span>
          </button>

          {!isCompleted ? (
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedOption !== null
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex + 1 === 5 ? 'See Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={startNewQuizSession}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
