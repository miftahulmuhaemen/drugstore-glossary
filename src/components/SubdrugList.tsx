import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Drug, SubDrug } from '../types/drug';

interface SubdrugListProps {
  selectedDrug: Drug | null;
  selectedSubdrug: SubDrug | null;
  onSubdrugSelect: (subdrug: SubDrug) => void;
}

export const SubdrugList: React.FC<SubdrugListProps> = ({
  selectedDrug,
  selectedSubdrug,
  onSubdrugSelect
}) => {
  const subdrugs = selectedDrug?.subdrugs || [];

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 id="subdrugs-title">Subdrugs ({subdrugs.length})</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedDrug ? (
            subdrugs.length > 0 ? (
              <motion.ul
                key="subdrugs-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="divide-y divide-gray-200"
                role="listbox"
                aria-labelledby="subdrugs-title"
              >
                {subdrugs.map((subdrug, index) => (
                  <motion.li
                    key={`${subdrug.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <button
                      type="button"
                      onClick={() => onSubdrugSelect(subdrug)}
                      className={`list-item w-full text-left ${
                        selectedSubdrug === subdrug ? 'list-item-active' : ''
                      }`}
                      role="option"
                      aria-selected={selectedSubdrug === subdrug}
                    >
                      <div className="font-medium text-sm">
                        {subdrug.name || '—'}
                      </div>
                      {subdrug.sediaan && (
                        <div className="text-xs text-gray-600 mt-1">
                          {subdrug.sediaan}
                        </div>
                      )}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                key="no-subdrugs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 text-center text-gray-500"
              >
                No subdrugs available
              </motion.div>
            )
          ) : (
            <motion.div
              key="select-drug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center text-gray-500"
            >
              Select a drug to view subdrugs
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
