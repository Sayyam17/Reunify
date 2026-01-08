
import React, { useState } from 'react';
import { generateLetter } from '../services/geminiService';
import Spinner from './Spinner';

type LetterState = 'idle' | 'loading' | 'success' | 'error';

interface LetterGeneratorProps {
    onLetterGenerated: (letter: string) => void;
}

const LetterGenerator: React.FC<LetterGeneratorProps> = ({ onLetterGenerated }) => {
  const [advice, setAdvice] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [letterState, setLetterState] = useState<LetterState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerateLetter = async () => {
    if (!advice.trim()) {
      setErrorMessage('Please provide some context for the letter.');
      setLetterState('error');
      return;
    }
    setLetterState('loading');
    setErrorMessage('');
    try {
      const letter = await generateLetter(advice);
      setGeneratedLetter(letter);
      onLetterGenerated(letter);
      setLetterState('success');
    } catch (error) {
       setErrorMessage(error instanceof Error ? error.message : 'Failed to generate text.');
       setLetterState('error');
    }
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg h-full flex flex-col">
      <h3 className="text-xl font-bold text-brand-primary mb-2 text-left">
        Accompanying Letter
      </h3>
      {letterState !== 'success' && (
        <>
          <p className="text-gray-300 mb-2 text-left text-sm">
            Describe the relationship or context for a custom letter.
          </p>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="e.g. A reunion of old childhood friends..."
            className="w-full p-2 rounded bg-slate-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            rows={2}
          />
          <button
            onClick={handleGenerateLetter}
            disabled={letterState === 'loading'}
            className="mt-3 w-full bg-brand-secondary hover:bg-brand-secondary-hover disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {letterState === 'loading' ? 'Generating...' : 'Generate Letter'}
          </button>
        </>
      )}

      {letterState === 'loading' && (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4 min-h-[100px]">
          <Spinner />
        </div>
      )}
      
      {letterState === 'error' && (
         <div className="mt-4 p-3 bg-red-900/50 text-red-300 border border-red-500 rounded-lg text-center text-sm">
            <p>{errorMessage}</p>
        </div>
      )}

      {letterState === 'success' && (
        <div className="mt-2 p-4 bg-slate-900/70 rounded-lg text-left flex-grow animate-fade-in-up">
          <p className="text-gray-200 whitespace-pre-wrap font-serif leading-relaxed text-sm italic">{generatedLetter}</p>
        </div>
      )}
    </div>
  );
};

export default LetterGenerator;
