import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './components/SearchBar';
import { AlphabetIndex } from './components/AlphabetIndex';
import { DrugList } from './components/DrugList';
import { SubdrugList } from './components/SubdrugList';
import { DetailsPanel } from './components/DetailsPanel';
import { useDrugData } from './hooks/useDrugData';
import { useDebounce } from './hooks/useDebounce';
import { useScrollToSection } from './hooks/useScrollToSection';
import type { Drug, SubDrug } from './types/drug';

const queryClient = new QueryClient();

const normalizeString = (s: string): string => {
  return (s || '').toString().toLowerCase();
};

const DrugstoreApp: React.FC = memo(() => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [selectedSubdrug, setSelectedSubdrug] = useState<SubDrug | null>(null);
  const [query, setQuery] = useState('');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const { data: drugData = [], isLoading, error } = useDrugData();
  const { scrollToSection, scrollToTop } = useScrollToSection();

  // Calculate available letters
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    drugData.forEach(drug => {
      const firstChar = drug.name.charAt(0).toUpperCase();
      if (firstChar >= 'A' && firstChar <= 'Z') {
        letters.add(firstChar);
      }
    });
    return letters;
  }, [drugData]);

  // Filter drugs based on letter and search query
  const filteredDrugs = useMemo(() => {
    return drugData.filter(drug => {
      const name = normalizeString(drug.name);
      const letterMatch = selectedLetter 
        ? name.startsWith(selectedLetter.toLowerCase())
        : true;
      const queryMatch = debouncedQuery
        ? name.includes(normalizeString(debouncedQuery))
        : true;
      return letterMatch && queryMatch;
    });
  }, [drugData, selectedLetter, debouncedQuery]);

  // Handle letter selection
  const handleLetterSelect = useCallback((letter: string | null) => {
    setSelectedLetter(letter);
    setSelectedDrug(null);
    setSelectedSubdrug(null);
  }, []);

  // Handle drug selection
  const handleDrugSelect = useCallback((drug: Drug) => {
    setSelectedDrug(drug);
    setSelectedSubdrug(null);
    
    // Mobile auto-scroll behavior
    if (window.innerWidth < 768) {
      setTimeout(() => scrollToSection('subdrugs-title'), 100);
    }
    setShowScrollToTop(true);
  }, [scrollToSection]);

  // Handle subdrug selection
  const handleSubdrugSelect = useCallback((subdrug: SubDrug) => {
    setSelectedSubdrug(subdrug);
    
    // Mobile auto-scroll behavior
    if (window.innerWidth < 768) {
      setTimeout(() => scrollToSection('details-title'), 100);
    }
    setShowScrollToTop(true);
  }, [scrollToSection]);

  // Handle query change
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedDrug(null);
    setSelectedSubdrug(null);
  }, []);

  // Handle scroll to top
  const handleScrollToTop = useCallback(() => {
    scrollToTop();
    setShowScrollToTop(false);
  }, [scrollToTop]);

  // Listen for scroll events to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading drug data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-600"
        >
          <p className="text-lg font-semibold mb-2">Failed to load data</p>
          <p className="text-sm">Please check your connection and try again.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl pb-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4">
            <img src="/logo.png" alt="Si Paman Obat Logo" className="h-[100px] object-contain px-2 my-2 w-auto" />
            <SearchBar
              query={query}
              onQueryChange={handleQueryChange}
              placeholder="Search drug..."
            />
          </div>
        </motion.header>

        {/* Alphabet Navigation */}
        <div className="mb-6">
          <AlphabetIndex
            selectedLetter={selectedLetter}
            onLetterSelect={handleLetterSelect}
            availableLetters={availableLetters}
          />
        </div>

        {/* Main Layout */}
        <main className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Drugs Panel */}
          <div className="order-1">
            <DrugList
              drugs={filteredDrugs}
              selectedDrug={selectedDrug}
              onDrugSelect={handleDrugSelect}
              query={debouncedQuery}
            />
          </div>

          {/* Subdrugs Panel */}
          <div className="order-2">
            <SubdrugList
              selectedDrug={selectedDrug}
              selectedSubdrug={selectedSubdrug}
              onSubdrugSelect={handleSubdrugSelect}
            />
          </div>

          {/* Details Panel */}
          <div className="order-3 tablet:col-span-2 desktop:col-span-1">
            <DetailsPanel
              selectedSubdrug={selectedSubdrug}
              selectedDrugName={selectedDrug?.name}
            />
          </div>
        </main>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleScrollToTop}
              className="fixed bottom-20 right-3 bg-blue-600 hover:bg-blue-700 text-white px-1 py-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-70"
              aria-label="Return to top"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer - Fixed at bottom */}
      <AnimatePresence>
        {!showScrollToTop && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full py-4 text-center text-gray-600 text-sm bg-white border-t border-gray-200
              fixed bottom-0 left-0 right-0"
            style={{ pointerEvents: 'auto' }}
          >
            <a
              href="https://www.instagram.com/miftahulmuhaemen/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              @MiftahulMuhaemen on Instagram
            </a>
          </motion.footer>
        )}
      </AnimatePresence>
      <div className="h-16" aria-hidden="true"></div>
    </div>
  );
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DrugstoreApp />
    </QueryClientProvider>
  );
}

export default App;