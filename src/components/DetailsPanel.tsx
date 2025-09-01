import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubDrug } from '../types/drug';

interface DetailsPanelProps {
  selectedSubdrug: SubDrug | null;
  selectedDrugName?: string;
}

const fieldLabels: Record<string, string> = {
  name: 'Nama',
  'kelas terapi': 'Kelas Terapi',
  'sub kelas terapi': 'Sub Kelas Terapi',
  'sub sub kelas terapi': 'Sub Sub Kelas Terapi',
  'kategori antibiotik': 'Kategori Antibiotik',
  'nama obat': 'Nama Obat',
  sediaan: 'Sediaan',
  kekuatan: 'Kekuatan',
  satuan: 'Satuan Obat',
  fpktp: 'FPKTP',
  fpktl: 'FPKTL',
  pp: 'PP',
  prb: 'PRB',
  oen: 'OEN',
  kanker: 'Kanker',
  komposisi: 'Komposisi',
  program: 'Program',
  'peresepan maksimal': 'Peresepan Maksimal',
  'restriksi obat': 'Restriksi Obat',
  'ketentuan tambahan': 'Ketentuan Tambahan',
  'berkas lampiran': 'Berkas Lampiran',
  'restriksi kelas terapi': 'Restriksi Kelas Terapi',
  'restriksi sub sub kelas terapi': 'Restriksi Sub Sub Kelas Terapi',
  'restriksi sediaan': 'Restriksi Sediaan',
  'restriksi sub kelas terapi': 'Restriksi Sub Kelas Terapi',
  alias: 'Alias',
};

const fieldOrder = [
  'name',
  'kelas terapi',
  'sub kelas terapi',
  'sub sub kelas terapi',
  'kategori antibiotik',
  'nama obat',
  'sediaan',
  'kekuatan',
  'satuan',
  'fpktp',
  'fpktl',
  'pp',
  'prb',
  'oen',
  'kanker',
  'komposisi',
  'program',
  'peresepan maksimal',
  'restriksi obat',
  'ketentuan tambahan',
  'berkas lampiran',
  'restriksi kelas terapi',
  'restriksi sub sub kelas terapi',
  'restriksi sediaan',
  'restriksi sub kelas terapi',
  'alias',
];

const asDisplayValue = (value: any): React.ReactNode => {
  if (typeof value === 'boolean') {
    return (
      <input
        type="checkbox"
        checked={value}
        disabled
        className="rounded focus:ring-blue-500"
        aria-label={value ? 'Yes' : 'No'}
      />
    );
  }
  
  if (value === null || value === undefined) return '—';
  
  const stringValue = String(value).trim();
  if (stringValue === '') return '—';
  
  // Convert newlines to line breaks for display
  return stringValue.split('\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));
};

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedSubdrug,
  selectedDrugName
}) => {
  const detailRows = useMemo(() => {
    if (!selectedSubdrug) return [];
    
    const orderedRows: Array<[string, string, React.ReactNode]> = [];
    const renderedKeys = new Set<string>();
    
    // Add ordered fields first
    fieldOrder.forEach(key => {
      if (!(key in selectedSubdrug)) return;
      const value = selectedSubdrug[key];
      if ((value === undefined || value === null || String(value).trim() === '') && typeof value !== 'boolean') return;
      
      const label = fieldLabels[key] || key;
      const displayValue = asDisplayValue(value);
      orderedRows.push([key, label, displayValue]);
      renderedKeys.add(key);
    });
    
    // Add any remaining fields
    Object.keys(selectedSubdrug).forEach(key => {
      if (renderedKeys.has(key)) return;
      const value = selectedSubdrug[key];
      if ((value === undefined || value === null || String(value).trim() === '') && typeof value !== 'boolean') return;
      
      const label = fieldLabels[key] || key;
      const displayValue = asDisplayValue(value);
      orderedRows.push([key, label, displayValue]);
    });
    
    return orderedRows;
  }, [selectedSubdrug]);

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 id="details-title">Details</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedSubdrug ? (
            <motion.div
              key="details-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedSubdrug.name || 'Details'}
              </h3>
              {detailRows.length > 0 ? (
                <table className="details-table">
                  <tbody>
                    {detailRows.map(([key, label, value]) => (
                      <tr key={key}>
                        <td className="key">{label}</td>
                        <td className="value">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500">No details available</div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="select-subdrug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center text-gray-500"
            >
              {selectedDrugName ? 'Select a subdrug to view details' : 'Select a drug and subdrug'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
