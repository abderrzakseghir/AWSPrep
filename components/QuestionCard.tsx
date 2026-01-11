import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Tag } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onNext: (wasCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onNext, questionNumber, totalQuestions }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOptions([]);
    setIsSubmitted(false);
  }, [question]);

  const isMultiSelect = question.correctAnswerIds.length > 1;

  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return;

    if (isMultiSelect) {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        if (selectedOptions.length < question.correctAnswerIds.length) {
          setSelectedOptions([...selectedOptions, optionId]);
        }
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleNext = () => {
    const isCorrect = 
      selectedOptions.length === question.correctAnswerIds.length &&
      selectedOptions.every(id => question.correctAnswerIds.includes(id));
    onNext(isCorrect);
  };

  const getOptionStyle = (optionId: string) => {
    const isSelected = selectedOptions.includes(optionId);
    const isCorrect = question.correctAnswerIds.includes(optionId);
    
    if (isSubmitted) {
      if (isCorrect) return "border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500";
      if (isSelected && !isCorrect) return "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500";
      return "border-gray-200 opacity-50";
    }

    if (isSelected) return "border-blue-500 bg-blue-50 ring-1 ring-blue-500 text-blue-900";
    return "border-gray-200 hover:border-blue-300 hover:bg-gray-50";
  };

  const isSelectionComplete = isMultiSelect 
    ? selectedOptions.length === question.correctAnswerIds.length 
    : selectedOptions.length === 1;

  const getCategoryColor = (category: string) => {
    switch(category) {
        case 'Security and Compliance': return 'text-red-600 bg-red-50 border-red-100';
        case 'Billing, Pricing, and Support': return 'text-green-600 bg-green-50 border-green-100';
        case 'Cloud Concepts': return 'text-purple-600 bg-purple-50 border-purple-100';
        default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      
      {/* Header / Progress */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
        <span className="font-medium text-base text-slate-300">Question {questionNumber} / {totalQuestions}</span>
        <span className="text-sm font-mono bg-slate-800 px-2 py-1 rounded text-orange-400">CLF-C02</span>
      </div>

      <div className="p-6 md:p-8">
        {/* Category Tag */}
        <div className="mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(question.category)}`}>
                <Tag size={14} />
                {question.category}
            </span>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed mb-2">
            {question.text}
          </h2>
          {isMultiSelect && (
            <div className="inline-flex items-center gap-2 text-base font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              <AlertCircle size={18} />
              Select {question.correctAnswerIds.length} options
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-start gap-3 ${getOptionStyle(option.id)}`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                selectedOptions.includes(option.id) 
                  ? (isSubmitted && question.correctAnswerIds.includes(option.id) ? 'border-green-500 bg-green-500 text-white' : (isSubmitted && !question.correctAnswerIds.includes(option.id) ? 'border-red-500 bg-red-500 text-white' : 'border-blue-500 bg-blue-500 text-white'))
                  : 'border-gray-300'
              }`}>
                {isSubmitted && question.correctAnswerIds.includes(option.id) && <CheckCircle2 size={16} />}
                {isSubmitted && selectedOptions.includes(option.id) && !question.correctAnswerIds.includes(option.id) && <XCircle size={16} />}
                {!isSubmitted && selectedOptions.includes(option.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
              <span className="text-lg">{option.text}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!isSelectionComplete}
              className={`w-full py-4 rounded-lg font-bold text-lg text-white transition-colors flex justify-center items-center gap-2
                ${isSelectionComplete ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}
              `}
            >
              Check Answer
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">Explanation:</span>
                </h3>
                <p className="text-gray-800 leading-relaxed text-base">
                  {question.explanation}
                </p>
              </div>
              
              <button
                onClick={handleNext}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-lg shadow-md flex justify-center items-center gap-2 group transition-all"
              >
                Next Question
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;