import React from 'react';
import { motion } from 'framer-motion';

interface AlphabetIndexProps {
  selectedLetter: string | null;
  onLetterSelect: (letter: string | null) => void;
  availableLetters?: Set<string>;
}

export const AlphabetIndex: React.FC<AlphabetIndexProps> = ({
  selectedLetter,
  onLetterSelect,
  availableLetters
}) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-1 justify-center tablet:justify-start"
      aria-label="Alphabetical index"
    >
      <button
        type="button"
        onClick={() => onLetterSelect(null)}
        className={`letter-btn ${
          selectedLetter === null ? 'letter-btn-active' : 'letter-btn-inactive'
        }`}
        aria-pressed={selectedLetter === null}
        aria-label="Filter by letter All"
      >
        All
      </button>
      {letters.map((letter) => {
        const isAvailable = !availableLetters || availableLetters.has(letter);
        const isActive = selectedLetter === letter;
        
        return (
          <button
            key={letter}
            type="button"
            onClick={() => onLetterSelect(letter)}
            disabled={!isAvailable}
            className={`letter-btn ${
              isActive
                ? 'letter-btn-active'
                : isAvailable
                ? 'letter-btn-inactive'
                : 'letter-btn-inactive opacity-50 cursor-not-allowed'
            }`}
            aria-pressed={isActive}
            aria-label={`Filter by letter ${letter}`}
          >
            {letter}
          </button>
        );
      })}
    </motion.nav>
  );
};
