import React, { useState } from 'react';
import { Check, SlidersHorizontal } from 'lucide-react';
import { FILTERS } from '../config/filters';
import { FilterCategory, FilterId } from '../types/photobooth';
import { FilterEffects } from './FilterEffects';

interface FilterPickerProps { selectedFilter: FilterId; onSelect: (filter: FilterId) => void; compact?: boolean; previewPhoto?: string }
const categories: ('Semua' | FilterCategory)[] = ['Semua','Natural','Portrait','Vintage','Monochrome','Creative'];

export const FilterPicker: React.FC<FilterPickerProps> = ({ selectedFilter, onSelect, compact, previewPhoto }) => {
  const [category,setCategory] = useState<(typeof categories)[number]>('Semua');
  const filters = Object.values(FILTERS).filter(filter => category === 'Semua' || filter.category === category);
  return (
    <section className={`filter-picker ${compact ? 'filter-picker-compact' : ''}`} aria-label="Filter photobooth">
      <div className="filter-picker-heading"><h3><SlidersHorizontal size={15} /> Filter Photobooth</h3><span>{Object.keys(FILTERS).length} efek</span></div>
      <div className="filter-category-tabs" role="group" aria-label="Kategori filter">{categories.map(item => <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={category === item ? 'is-active' : ''}>{item}</button>)}</div>
      <div className="filter-preview-grid">{filters.map(filter => <button type="button" key={filter.id} onClick={() => onSelect(filter.id)} className={`filter-preview-card ${selectedFilter === filter.id ? 'is-selected' : ''}`} aria-pressed={selectedFilter === filter.id} title={filter.description}>
        <span className="filter-preview-image"><img src={previewPhoto || "/filter-preview.svg"} alt="" style={{filter:filter.cssFilter}} loading="lazy" /><FilterEffects filter={filter} />{selectedFilter === filter.id && <span className="filter-preview-check"><Check size={12} /></span>}</span>
        <span className="filter-preview-name">{filter.name}</span>
      </button>)}</div>
      <p className="filter-active-label" aria-live="polite"><strong>{FILTERS[selectedFilter].name}</strong> · {FILTERS[selectedFilter].description}</p>
    </section>
  );
};
