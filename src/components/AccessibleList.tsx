import React, { useRef, useEffect, useCallback } from 'react';

interface AccessibleListProps<T> {
  items: T[];
  selectedItem: T | null;
  onItemSelect: (item: T) => void;
  renderItem: (item: T, index: number, isSelected: boolean) => React.ReactNode;
  getItemKey: (item: T, index: number) => string;
  className?: string;
  ariaLabel?: string;
  emptyMessage?: string;
}

export function AccessibleList<T>({
  items,
  selectedItem,
  onItemSelect,
  renderItem,
  getItemKey,
  className = '',
  ariaLabel,
  emptyMessage = 'No items available'
}: AccessibleListProps<T>) {
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndex = selectedItem ? items.indexOf(selectedItem) : -1;

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = selectedIndex < items.length - 1 ? selectedIndex + 1 : 0;
        onItemSelect(items[nextIndex]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
        onItemSelect(items[prevIndex]);
        break;
      case 'Home':
        event.preventDefault();
        onItemSelect(items[0]);
        break;
      case 'End':
        event.preventDefault();
        onItemSelect(items[items.length - 1]);
        break;
    }
  }, [items, selectedIndex, onItemSelect]);

  // Focus management
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement && selectedElement.focus) {
        selectedElement.focus();
      }
    }
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul
      ref={listRef}
      className={`divide-y divide-gray-200 ${className}`}
      role="listbox"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {items.map((item, index) => {
        const isSelected = selectedItem === item;
        return (
          <li key={getItemKey(item, index)} role="option" aria-selected={isSelected}>
            {renderItem(item, index, isSelected)}
          </li>
        );
      })}
    </ul>
  );
}
