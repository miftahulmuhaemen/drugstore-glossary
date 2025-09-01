import { useCallback } from 'react';

export const useScrollToSection = () => {
  const scrollToSection = useCallback((elementId: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior, block: 'start' });
    }
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior });
  }, []);

  return { scrollToSection, scrollToTop };
};
