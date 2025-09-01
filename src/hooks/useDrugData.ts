import { useQuery } from '@tanstack/react-query';
import type { Drug } from '../types/drug';

const fetchDrugData = async (): Promise<Drug[]> => {
  const response = await fetch('/data/data.json');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const useDrugData = () => {
  return useQuery({
    queryKey: ['drugData'],
    queryFn: fetchDrugData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
