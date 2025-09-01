import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Drug } from '../types/drug';
import { AccessibleList } from './AccessibleList';

interface DrugListProps {
  drugs: Drug[];
  selectedDrug: Drug | null;
  onDrugSelect: (drug: Drug) => void;
  query: string;
}

const normalizeString = (s: string): string => {
  return (s || '').toString().toLowerCase();
};

const highlightMatch = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;
  
  const normalizedText = normalizeString(text);
  const normalizedQuery = normalizeString(query);
  const index = normalizedText.indexOf(normalizedQuery);
  
  if (index === -1) return text;
  
  const beforeMatch = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const afterMatch = text.slice(index + query.length);
  
  return (
    <>
      {beforeMatch}
      <mark className="bg-yellow-200 text-gray-900">{match}</mark>
      {afterMatch}
    </>
  );
};

export const DrugList: React.FC<DrugListProps> = ({
  drugs,
  selectedDrug,
  onDrugSelect,
  query
}) => {
  const filteredDrugs = useMemo(() => {
    if (!query.trim()) return drugs;
    const normalizedQuery = normalizeString(query);
    return drugs.filter(drug => 
      normalizeString(drug.name).includes(normalizedQuery)
    );
  }, [drugs, query]);

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 id="drugs-title">Drugs ({filteredDrugs.length})</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key="drugs-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AccessibleList
              items={filteredDrugs}
              selectedItem={selectedDrug}
              onItemSelect={onDrugSelect}
              getItemKey={(drug) => drug.name}
              ariaLabel="List of drugs"
              emptyMessage="No drugs found"
              renderItem={(drug, index, isSelected) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  type="button"
                  onClick={() => onDrugSelect(drug)}
                  className={`list-item w-full text-left ${
                    isSelected ? 'list-item-active' : ''
                  }`}
                >
                  {highlightMatch(drug.name, query)}
                </motion.button>
              )}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
